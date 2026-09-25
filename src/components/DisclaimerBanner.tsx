import { useState, useRef, useEffect } from 'react';
import { Info, ChevronRight, X } from 'lucide-react';

export function DisclaimerBanner() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="card p-4 flex items-start gap-3 bg-surface-2">
        <div className="icon-box w-8 h-8 icon-green dark:text-[#34D399] dark:bg-[#10B981]/15 dark:border-[#10B981]/30 mt-0.5">
          <Info size={15} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted leading-relaxed">
            This assistant provides factual information from official sources only. It does not
            provide investment advice, recommendations, rankings, return predictions, or
            personalized financial guidance.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-sm text-primary dark:text-[#34D399] font-medium hover:underline flex items-center gap-0.5 whitespace-nowrap flex-shrink-0 mt-0.5 cursor-pointer"
        >
          Learn more
          <ChevronRight size={14} />
        </button>
      </div>

      {open && <LearnMoreModal onClose={() => setOpen(false)} />}
    </>
  );
}

function LearnMoreModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        ref={ref}
        className="surface relative w-full max-w-md rounded-2xl border border-default p-6 shadow-2xl animate-scale-in"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-primary transition-colors"
        >
          <X size={18} />
        </button>
        <div className="icon-box w-11 h-11 icon-green dark:text-[#34D399] dark:bg-[#10B981]/15 dark:border-[#10B981]/30 mb-4">
          <Info size={20} strokeWidth={1.75} />
        </div>
        <h3 className="text-base font-semibold mb-3">About this assistant</h3>
        <ul className="space-y-2.5 text-sm text-muted leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-[#34D399] mt-1.5 flex-shrink-0" />
            The assistant provides factual information only, sourced from official documents.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-[#34D399] mt-1.5 flex-shrink-0" />
            Information comes from official sources including HDFC Mutual Fund, SEBI, and AMFI.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-[#34D399] mt-1.5 flex-shrink-0" />
            The assistant does not provide investment advice, recommendations, or personalized financial guidance.
          </li>
        </ul>
        <button onClick={onClose} className="btn-primary rounded-lg px-5 py-2 text-sm mt-5">
          Got it
        </button>
      </div>
    </div>
  );
}
