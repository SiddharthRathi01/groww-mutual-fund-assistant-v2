import { useState, useRef, useEffect } from 'react';
import { FileCheck2, ShieldCheck, Leaf, ChevronDown } from 'lucide-react';

interface Feature {
  icon: typeof FileCheck2;
  title: string;
  subtitle: string;
  explanation: string;
  color: 'green' | 'blue' | 'purple';
}

const FEATURES: Feature[] = [
  {
    icon: FileCheck2,
    title: 'Verified Sources',
    subtitle: 'HDFC AMC · SEBI · AMFI',
    explanation: 'Answers are grounded in verified HDFC Mutual Fund, SEBI and AMFI sources.',
    color: 'green',
  },
  {
    icon: ShieldCheck,
    title: 'Factual Information',
    subtitle: 'Accurate and source-grounded',
    explanation:
      'This assistant provides factual scheme and service information rather than investment recommendations.',
    color: 'blue',
  },
  {
    icon: Leaf,
    title: 'Learn Confidently',
    subtitle: 'Make informed decisions',
    explanation:
      'Explore factual information about schemes, charges, risk, documents and other published details.',
    color: 'purple',
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  const colorClass = `icon-${feature.color}`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full card p-3.5 flex items-center gap-3 text-left hover:border-strong transition-colors"
      >
        <div className={`icon-box w-9 h-9 ${colorClass}`}>
          <feature.icon size={16} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-tight">{feature.title}</p>
          <p className="text-[11px] text-muted mt-0.5 leading-tight">{feature.subtitle}</p>
        </div>
        <ChevronDown
          size={14}
          className={`text-subtle transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-20 card p-3 animate-scale-in shadow-lg">
          <p className="text-xs text-muted leading-relaxed">{feature.explanation}</p>
        </div>
      )}
    </div>
  );
}

export function FeatureIndicators() {
  return (
    <div className="flex flex-col gap-2.5">
      {FEATURES.map((f) => (
        <FeatureCard key={f.title} feature={f} />
      ))}
    </div>
  );
}
