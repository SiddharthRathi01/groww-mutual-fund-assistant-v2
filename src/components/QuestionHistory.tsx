import { useState, useEffect, useCallback } from 'react';
import { History, ExternalLink, FileText, ChevronRight, Inbox, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchHistory, type HistoryEntry } from '@/lib/historyService';

function schemeName(scheme: string | null): string {
  return scheme ?? 'General';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function QuestionHistory({ refreshKey }: { refreshKey: number }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      setLoadError(false);
      return;
    }
    setLoading(true);
    setLoadError(false);
    try {
      const data = await fetchHistory();
      setEntries(data);
    } catch (err) {
      console.warn('[QuestionHistory] fetchHistory failed safely:', err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (!user) return null;

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="icon-box w-9 h-9 icon-blue">
          <History size={16} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-sm font-semibold">Question History</h2>
          <p className="text-xs text-muted mt-0.5">Your previous questions</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-2 rounded-lg h-12 animate-pulse" />
          ))}
        </div>
      ) : loadError ? (
        <div className="flex flex-col items-center text-center py-6 px-2">
          <div className="icon-box w-10 h-10 surface-2 border border-default mb-2.5 text-muted">
            <AlertCircle size={18} strokeWidth={1.75} />
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
            History temporarily unavailable
          </p>
          <p className="text-[11px] text-subtle mt-0.5">Your questions and answers are unaffected.</p>
          <button
            type="button"
            onClick={load}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium cursor-pointer"
          >
            <RefreshCw size={12} />
            Try again
          </button>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center text-center py-8">
          <div className="icon-box w-12 h-12 surface-2 border border-default mb-3">
            <Inbox size={20} className="text-subtle" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-muted">No questions yet</p>
          <p className="text-xs text-subtle mt-1 max-w-[200px]">
            Ask a question to start building your history.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[420px] overflow-y-auto scrollbar-thin">
          {entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setSelected(selected?.id === entry.id ? null : entry)}
              className={`w-full text-left rounded-lg px-3 py-2.5 transition-all border ${
                selected?.id === entry.id
                  ? 'bg-primary-soft border-primary'
                  : 'border-transparent hover:surface-2 hover:border-default'
              }`}
            >
              <p className="text-sm font-medium truncate">{entry.question}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-primary truncate">{schemeName(entry.scheme)}</span>
                <span className="text-subtle text-xs">·</span>
                <span className="text-xs text-subtle">{formatDate(entry.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-3 pt-3 border-t border-default animate-fade-in">
          <div className="flex items-center gap-1.5 mb-2">
            <ChevronRight size={14} className="text-subtle" />
            <span className="text-xs font-semibold text-muted uppercase tracking-wide">Answer</span>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-line">{selected.answer}</p>
          {selected.source_url && (
            <a
              href={selected.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-3"
            >
              <FileText size={12} />
              View source
              <ExternalLink size={10} className="opacity-60" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
