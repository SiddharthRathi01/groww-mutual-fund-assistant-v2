import { Building2, Layers, ShieldCheck, BarChart3, Scale, FileText, ExternalLink } from 'lucide-react';
import type { SchemeInfo } from '@/data/schemes';

const SCHEME_ICONS: Record<string, typeof Building2> = {
  building: Building2,
  layers: Layers,
  shield: ShieldCheck,
  chart: BarChart3,
  balance: Scale,
};

const SCHEME_COLORS: Record<string, string> = {
  green: 'icon-green',
  blue: 'icon-blue',
  purple: 'icon-purple',
  amber: 'icon-amber',
  teal: 'icon-teal',
};

interface SchemeInfoBarProps {
  scheme: SchemeInfo;
}

export function SchemeInfoBar({ scheme }: SchemeInfoBarProps) {
  const Icon = SCHEME_ICONS[scheme.icon] ?? Building2;
  const colorClass = SCHEME_COLORS[scheme.color] ?? 'icon-green';

  return (
    <div className="card p-4 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <div className={`icon-box w-10 h-10 ${colorClass}`}>
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-sm font-semibold">{scheme.name}</p>
          <p className="text-xs text-muted">
            {scheme.category} · {scheme.fundHouse}
          </p>
        </div>
      </div>
      {scheme.sourceUrl ? (
        <a
          href={scheme.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary dark:text-[#34D399] hover:underline flex items-center gap-1.5 surface-2 border border-default rounded-lg px-3 py-1.5 transition-colors hover:border-primary dark:hover:border-[#10B981] font-medium"
        >
          <FileText size={13} />
          View factsheet
          <ExternalLink size={11} className="opacity-60" />
        </a>
      ) : (
        <span className="text-xs text-muted flex items-center gap-1.5 surface-2 border border-default rounded-lg px-3 py-1.5 opacity-60 font-medium">
          <FileText size={13} />
          Factsheet unavailable
        </span>
      )}
    </div>
  );
}
