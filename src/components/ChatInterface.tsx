import { useState, useRef, useEffect } from 'react';
import {
  Send,
  ExternalLink,
  Sparkles,
  FileText,
  Target,
  Percent,
  BarChart3,
  AlertTriangle,
  ArrowLeftRight,
  Info,
  RefreshCw,
  Check,
} from 'lucide-react';
import type { SchemeInfo } from '@/data/schemes';
import { getExampleQuestions, fetchAnswer, type AnswerResult } from '@/lib/answerEngine';
import { useAuth } from '@/hooks/useAuth';
import { saveHistory } from '@/lib/historyService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sourceUrl?: string;
  sourceName?: string;
  lastUpdated?: string;
  isRefusal?: boolean;
}

interface ChatInterfaceProps {
  selectedScheme: SchemeInfo | null;
  onHistorySaved?: () => void;
}

const QUESTION_ICONS: Record<string, typeof Target> = {
  target: Target,
  percent: Percent,
  chart: BarChart3,
  alert: AlertTriangle,
  arrows: ArrowLeftRight,
};

const QUESTION_COLORS: Record<string, string> = {
  green: 'icon-green',
  blue: 'icon-blue',
  purple: 'icon-purple',
  amber: 'icon-amber',
  teal: 'icon-teal',
};

export function ChatInterface({ selectedScheme, onHistorySaved }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<'finding' | 'preparing'>('finding');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTurnRef = useRef<HTMLDivElement>(null);
  const isAutoScrollActiveRef = useRef(true);

  // Cycle concise, user-friendly loading state text without artificial delay
  useEffect(() => {
    if (!loading) {
      setLoadingPhase('finding');
      return;
    }
    const timer = setTimeout(() => {
      setLoadingPhase('preparing');
    }, 2200);
    return () => clearTimeout(timer);
  }, [loading]);

  // Monitor manual scroll upward to pause auto-following, or scrolling near bottom to resume
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    // If user is within 70px of the bottom, keep auto-following active
    // If user manually scrolls up beyond 70px, temporarily pause auto-follow
    isAutoScrollActiveRef.current = distanceFromBottom <= 70;
  };

  // Perform smooth scroll to keep active turn / bottom visible if auto-scroll is active
  const scrollToActiveTurn = (behavior: ScrollBehavior = 'smooth') => {
    if (!isAutoScrollActiveRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    // Prefer scrolling the bottom/active turn of the conversation container
    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  // Trigger auto-scroll on message updates or loading state change
  useEffect(() => {
    scrollToActiveTurn('smooth');
  }, [messages, loading, loadingPhase]);

  // Use ResizeObserver on scroll container content to keep active turn visible as content expands
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let previousHeight = container.scrollHeight;
    const observer = new ResizeObserver(() => {
      if (container.scrollHeight !== previousHeight) {
        previousHeight = container.scrollHeight;
        if (isAutoScrollActiveRef.current) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const askQuestion = async (question: string) => {
    if (!selectedScheme || loading || !question.trim()) return;

    // Resuming auto-follow immediately when user submits a new question
    isAutoScrollActiveRef.current = true;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: question,
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    setLoadingPhase('finding');

    // Ensure the new active turn is scrolled into view immediately
    requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    });

    const result: AnswerResult = await fetchAnswer(question, selectedScheme);

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: result.answer,
      sourceUrl: result.sourceUrl,
      sourceName: result.sourceName,
      lastUpdated: result.lastUpdated,
      isRefusal: result.isRefusal,
    };
    setMessages((m) => [...m, assistantMsg]);
    setLoading(false);

    // Once finished, smoothly finalize view at the completed turn
    requestAnimationFrame(() => {
      if (isAutoScrollActiveRef.current && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    });

    if (user && result.isAnswered && !result.isRefusal) {
      saveHistory({
        question,
        answer: result.answer,
        source_url: result.sourceUrl || null,
        scheme: selectedScheme.name,
      })
        .then(() => onHistorySaved?.())
        .catch((err) => console.error('[QuestionHistory] INSERT failed:', err));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askQuestion(input);
  };

  return (
    <div className="space-y-4">
      {/* Primary question area */}
      <div className="card p-5">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="icon-box w-10 h-10 icon-green">
              <Sparkles size={18} strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-base font-semibold">Ask your question</h3>
              <p className="text-xs text-muted mt-0.5">
                Select a scheme and ask a question about objective, charges, risk, benchmark, or
                other factual details.
              </p>
            </div>
          </div>

          {/* Goal 3: Clearer Selected-Scheme Context pill */}
          {selectedScheme ? (
            <div
              className="inline-flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-[#34D399] dark:bg-[#10B981]/10 dark:border-[#10B981]/30 font-medium animate-fade-in"
              role="status"
              aria-label={`Answering about ${selectedScheme.name}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-[#10B981]"></span>
              </span>
              <span>
                Answering about <strong className="font-semibold text-emerald-950 dark:text-emerald-200">{selectedScheme.name}</strong>
              </span>
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg surface-2 border border-dashed border-default text-muted"
              role="status"
            >
              <Info size={12} className="text-subtle" />
              <span>Select a scheme on the left to start</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!selectedScheme || loading}
              placeholder={
                selectedScheme
                  ? `Ask about ${selectedScheme.name} (e.g. exit load, benchmark)...`
                  : 'Select a scheme from the left first...'
              }
              aria-label={
                selectedScheme
                  ? `Ask about ${selectedScheme.name}`
                  : 'Select a scheme from the left first'
              }
              className="flex-1 surface-2 border border-default rounded-xl px-4 py-3 text-sm outline-none focus:border-primary dark:focus:border-[#10B981] focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-[#10B981]/25 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!selectedScheme || loading || !input.trim()}
              className="btn-primary dark:!bg-[#10B981] dark:hover:!bg-[#059669] dark:!text-white rounded-xl px-4 py-3 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={17} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2 mt-2.5 px-1">
            <div className="flex items-center gap-1.5">
              <Info size={11} className="text-subtle dark:text-[#34D399]/75" />
              <p className="text-[11px] text-subtle">Facts-only. No investment advice.</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-subtle">
              <Check size={11} className="text-emerald-500 dark:text-[#34D399]" strokeWidth={2.5} />
              <span>Verified sources</span>
            </div>
          </div>
        </form>
      </div>

      {/* Goal 4: More Polished First-Use / Empty State */}
      {messages.length === 0 && (
        <div className="card p-6 text-center border-dashed border-default animate-fade-in">
          <div className="icon-box w-12 h-12 icon-green mx-auto mb-3">
            <Sparkles size={20} strokeWidth={1.75} />
          </div>
          <h4 className="text-base font-semibold text-[rgb(var(--color-text))]">
            Ask about HDFC Mutual Fund schemes
          </h4>
          <p className="text-xs text-muted max-w-md mx-auto mt-1 mb-3.5 leading-relaxed">
            Get concise answers grounded in verified mutual fund sources.
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] text-emerald-800 dark:text-[#34D399] bg-emerald-500/10 dark:bg-[#10B981]/10 px-3 py-1 rounded-full border border-emerald-500/20 dark:border-[#10B981]/25 font-medium">
            <Check size={11} strokeWidth={2.5} className="text-emerald-600 dark:text-[#34D399]" />
            <span>Verified sources</span>
            <span className="text-emerald-400/60 dark:text-[#34D399]/40">·</span>
            <span>Official scheme documents &amp; KIMs</span>
          </div>
          {!selectedScheme && (
            <p className="text-[11px] text-subtle mt-3">
              Choose a scheme from the list on the left to begin asking questions.
            </p>
          )}
        </div>
      )}

      {/* Answer / conversation area */}
      {messages.length > 0 && (
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="card p-4 max-h-[440px] overflow-y-auto scrollbar-thin space-y-4 scroll-smooth"
        >
          {messages.map((msg, idx) => {
            const isLatestTurn = idx === messages.length - 1;
            return (
              <div
                key={msg.id}
                ref={isLatestTurn ? activeTurnRef : undefined}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                {msg.role === 'assistant' && (
                  <div
                    className={`icon-box w-7 h-7 mr-2 mt-0.5 flex-shrink-0 ${
                      msg.isRefusal
                        ? 'bg-red-50 text-red-600 border border-red-200/80 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/60'
                        : 'icon-green'
                    }`}
                  >
                    {msg.isRefusal ? (
                      <AlertTriangle size={12} strokeWidth={2} />
                    ) : (
                      <Sparkles size={12} strokeWidth={1.75} />
                    )}
                  </div>
                )}
                <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'min-w-0'}`}>
                  {/* Goal 2: Stronger Answer / Source Visual Hierarchy */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'btn-primary rounded-br-md dark:!bg-[#10B981] dark:!text-white dark:border-transparent'
                        : msg.isRefusal
                          ? 'bg-red-50/75 border border-red-200/90 text-slate-800 dark:bg-red-950/25 dark:border-red-900/50 dark:text-slate-200 rounded-bl-md'
                          : 'surface-2 border border-default rounded-bl-md shadow-xs'
                    }`}
                  >
                    {/* A. The dominant factual answer */}
                    <p
                      className={`text-sm leading-relaxed whitespace-pre-line font-normal ${
                        msg.role === 'user'
                          ? 'text-inherit dark:!text-white'
                          : 'text-[rgb(var(--color-text))]'
                      }`}
                    >
                      {msg.text}
                    </p>

                    {/* Controlled retry button for temporary service issues */}
                    {msg.role === 'assistant' &&
                      msg.text.includes('temporarily unable') &&
                      messages[idx - 1]?.role === 'user' && (
                        <div className="mt-2.5 pt-2 border-t border-default/40">
                          <button
                            type="button"
                            onClick={() => askQuestion(messages[idx - 1].text)}
                            disabled={loading || !selectedScheme}
                            className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-[#34D399] hover:underline font-medium cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw size={12} />
                            Try again
                          </button>
                        </div>
                      )}

                    {/* B & C. Visually secondary Source attribution & Last updated */}
                    {msg.role === 'assistant' &&
                      !msg.isRefusal &&
                      (msg.sourceUrl || msg.sourceName) && (
                        <div className="mt-2.5 pt-2 border-t border-default/40 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-xs text-muted">
                          <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                            <span className="text-subtle font-medium text-[11px]">Source:</span>
                            {msg.sourceUrl ? (
                              <a
                                href={msg.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary dark:text-[#34D399] hover:underline font-medium"
                              >
                                <FileText size={11} className="opacity-80 flex-shrink-0" />
                                <span>{msg.sourceName || 'HDFC Mutual Fund'}</span>
                                <ExternalLink size={10} className="opacity-60 flex-shrink-0" />
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-muted font-medium">
                                <FileText size={11} className="opacity-80 flex-shrink-0" />
                                <span>{msg.sourceName || 'HDFC Mutual Fund'}</span>
                              </span>
                            )}
                            {msg.lastUpdated && (
                              <span className="text-[11px] text-subtle">
                                · Updated {msg.lastUpdated}
                              </span>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-[#34D399] font-medium">
                            <Check size={11} strokeWidth={2.5} className="text-emerald-700 dark:text-[#10B981]" />
                            Verified
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Goal 1: Better Answer Generation / Loading State */}
          {loading && (
            <div
              ref={activeTurnRef}
              className="flex justify-start items-start gap-2.5 animate-fade-in"
              role="status"
              aria-live="polite"
              aria-label={
                loadingPhase === 'finding'
                  ? 'Finding verified information…'
                  : 'Preparing your answer…'
              }
            >
              <div className="icon-box w-7 h-7 icon-green flex-shrink-0 mt-0.5">
                <Sparkles size={12} strokeWidth={1.75} />
              </div>
              <div className="surface-2 border border-default rounded-2xl rounded-bl-md px-4 py-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1">
                    <span className="typing-dot w-2 h-2 rounded-full bg-primary dark:bg-[#34D399] inline-block" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-primary dark:bg-[#34D399] inline-block" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-primary dark:bg-[#34D399] inline-block" />
                  </div>
                  <span className="text-xs font-medium text-[rgb(var(--color-text))]">
                    {loadingPhase === 'finding'
                      ? 'Finding verified information…'
                      : 'Preparing your answer…'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Try asking — secondary, below the primary question area */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide">
            Try asking
          </p>
          {selectedScheme && (
            <span className="text-[11px] text-subtle">
              Click any question to ask about {selectedScheme.name}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {getExampleQuestions().map((q) => {
            const Icon = QUESTION_ICONS[q.icon] ?? Target;
            const colorClass = QUESTION_COLORS[q.color] ?? 'icon-green';
            return (
              <button
                key={q.text}
                type="button"
                onClick={() => askQuestion(q.text)}
                disabled={!selectedScheme || loading}
                aria-label={q.text}
                className="card p-3 flex items-center gap-3 text-left hover:border-strong transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                <div className={`icon-box w-9 h-9 ${colorClass} group-hover:scale-105 transition-transform flex-shrink-0`}>
                  <Icon size={15} strokeWidth={1.75} />
                </div>
                <span className="text-sm text-[rgb(var(--color-text))] group-hover:text-primary transition-colors">
                  {q.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
