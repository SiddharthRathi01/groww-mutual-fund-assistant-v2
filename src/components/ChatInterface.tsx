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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const askQuestion = async (question: string) => {
    if (!selectedScheme || loading || !question.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: question,
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    const result: AnswerResult = await fetchAnswer(question, selectedScheme);

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: result.answer,
      sourceUrl: result.sourceUrl,
      sourceName: result.sourceName,
      isRefusal: result.isRefusal,
    };
    setMessages((m) => [...m, assistantMsg]);
    setLoading(false);

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
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-box w-10 h-10 icon-green">
            <Sparkles size={18} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-semibold">Ask your question</h3>
            <p className="text-xs text-muted mt-0.5">
              Select a scheme and ask a question about the fund's objective, portfolio, charges,
              risk, or other factual details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!selectedScheme || loading}
              placeholder={selectedScheme ? 'Type your question here...' : 'Select a scheme first'}
              className="flex-1 surface-2 border border-default rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!selectedScheme || loading || !input.trim()}
              className="btn-primary rounded-xl px-4 py-3 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={17} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 px-1">
            <Info size={11} className="text-subtle" />
            <p className="text-[11px] text-subtle">Facts-only. No investment advice.</p>
          </div>
        </form>
      </div>

      {/* Answer / conversation area */}
      {messages.length > 0 && (
        <div className="card p-4 max-h-[360px] overflow-y-auto scrollbar-thin space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              {msg.role === 'assistant' && (
                <div className="icon-box w-7 h-7 icon-green mr-2 mt-0.5 flex-shrink-0">
                  <Sparkles size={12} strokeWidth={1.75} />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === 'user' ? '' : 'min-w-0'}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'btn-primary rounded-br-md'
                      : msg.isRefusal
                        ? 'surface-2 border border-strong rounded-bl-md'
                        : 'surface-2 border border-default rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
                {msg.role === 'assistant' && !msg.isRefusal && msg.sourceUrl && (
                  <div className="flex items-center gap-3 mt-2 pl-1">
                    <a
                      href={msg.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <FileText size={12} />
                      {msg.sourceName}
                      <ExternalLink size={10} className="opacity-60" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start items-center gap-2 animate-fade-in">
              <div className="icon-box w-7 h-7 icon-green flex-shrink-0">
                <Sparkles size={12} strokeWidth={1.75} />
              </div>
              <div className="surface-2 border border-default rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Try asking — secondary, below the primary question area */}
      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
          Try asking
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {getExampleQuestions().map((q) => {
            const Icon = QUESTION_ICONS[q.icon] ?? Target;
            const colorClass = QUESTION_COLORS[q.color] ?? 'icon-green';
            return (
              <button
                key={q.text}
                onClick={() => askQuestion(q.text)}
                disabled={!selectedScheme || loading}
                className="card p-3 flex items-center gap-3 text-left hover:border-strong transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className={`icon-box w-9 h-9 ${colorClass}`}>
                  <Icon size={15} strokeWidth={1.75} />
                </div>
                <span className="text-sm text-muted">{q.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
