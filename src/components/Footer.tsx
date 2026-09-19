import { useState, useRef, useEffect } from 'react';
import { X, ExternalLink, Info, FileCheck2, ShieldAlert, Lock } from 'lucide-react';

type FooterSection = 'about' | 'sources' | 'disclaimer' | 'privacy';

interface FooterModalData {
  title: string;
  icon: typeof Info;
  color: 'green' | 'blue' | 'purple' | 'amber';
}

const MODAL_DATA: Record<FooterSection, FooterModalData> = {
  about: { title: 'About FundFacts', icon: Info, color: 'green' },
  sources: { title: 'Verified Sources', icon: FileCheck2, color: 'blue' },
  disclaimer: { title: 'Disclaimer', icon: ShieldAlert, color: 'amber' },
  privacy: { title: 'Privacy', icon: Lock, color: 'purple' },
};

export function Footer() {
  const [active, setActive] = useState<FooterSection | null>(null);

  return (
    <>
      <footer className="border-t border-default mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {(['about', 'sources', 'disclaimer', 'privacy'] as FooterSection[]).map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className="text-xs text-muted hover:text-primary transition-colors cursor-pointer"
              >
                {MODAL_DATA[key].title.replace('FundFacts', '').trim() || key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-xs text-subtle">
            Built for learning. Not for investment advice.
          </p>
        </div>
      </footer>

      {active && <FooterModal section={active} onClose={() => setActive(null)} />}
    </>
  );
}

function FooterModal({ section, onClose }: { section: FooterSection; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const data = MODAL_DATA[section];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const colorClass = `icon-${data.color}`;

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
        <div className={`icon-box w-11 h-11 ${colorClass} mb-4`}>
          <data.icon size={20} strokeWidth={1.75} />
        </div>
        <h3 className="text-base font-semibold mb-3">{data.title}</h3>
        {section === 'about' && (
          <div className="space-y-2.5 text-sm text-muted leading-relaxed">
            <p>
              FundFacts is a factual mutual fund information assistant designed to help users find
              concise information about selected HDFC Mutual Fund schemes using verified public sources.
            </p>
            <p>
              The assistant is designed for learning and factual information, not investment advice.
            </p>
          </div>
        )}
        {section === 'sources' && (
          <div className="space-y-2.5 text-sm text-muted leading-relaxed">
            <p>The assistant uses verified public information from official sources.</p>
            <ul className="space-y-1.5 mt-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <a
                  href="https://www.hdfcfund.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  HDFC Mutual Fund
                  <ExternalLink size={11} className="opacity-60" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <a
                  href="https://www.sebi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  SEBI
                  <ExternalLink size={11} className="opacity-60" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <a
                  href="https://www.amfiindia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  AMFI
                  <ExternalLink size={11} className="opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        )}
        {section === 'disclaimer' && (
          <p className="text-sm text-muted leading-relaxed">
            This assistant provides factual information from official sources only. It does not
            provide investment advice, recommendations, rankings, return predictions, or
            personalized financial guidance.
          </p>
        )}
        {section === 'privacy' && (
          <p className="text-sm text-muted leading-relaxed">
            FundFacts is designed with privacy in mind. The assistant does not request or require
            sensitive financial information such as PAN numbers, folio numbers, bank details,
            holdings, or transaction information to answer factual questions.
          </p>
        )}
        <button onClick={onClose} className="btn-primary rounded-lg px-5 py-2 text-sm mt-5">
          Close
        </button>
      </div>
    </div>
  );
}
