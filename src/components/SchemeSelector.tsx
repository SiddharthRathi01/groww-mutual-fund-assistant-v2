import { Search, X, Building2, Layers, ShieldCheck, BarChart3, Scale } from 'lucide-react';
import { useState, useMemo } from 'react';
import { HDFC_SCHEMES, type SchemeInfo } from '@/data/schemes';

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

interface SchemeSelectorProps {
  selected: SchemeInfo | null;
  onSelect: (scheme: SchemeInfo) => void;
}

export function SchemeSelector({ selected, onSelect }: SchemeSelectorProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return HDFC_SCHEMES;
    const q = query.toLowerCase();
    return HDFC_SCHEMES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="card p-4">
      <h2 className="text-sm font-semibold mb-3">Select a Scheme</h2>

      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search among 5 schemes..."
          className="w-full surface-2 border border-default rounded-lg pl-10 pr-9 py-2.5 text-sm outline-none focus:border-primary transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-subtle hover:text-primary transition-colors"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">No schemes found</p>
        ) : (
          filtered.map((scheme) => {
            const isActive = selected?.code === scheme.code;
            const Icon = SCHEME_ICONS[scheme.icon] ?? Building2;
            const colorClass = SCHEME_COLORS[scheme.color] ?? 'icon-green';
            return (
              <button
                key={scheme.code}
                onClick={() => onSelect(scheme)}
                className={`w-full text-left rounded-lg px-3 py-2.5 transition-all border flex items-center gap-3 ${
                  isActive
                    ? 'bg-primary-soft border-primary'
                    : 'border-transparent hover:surface-2 hover:border-default'
                }`}
              >
                <div className={`icon-box w-9 h-9 ${colorClass}`}>
                  <Icon size={16} strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium truncate ${isActive ? 'text-primary' : ''}`}
                  >
                    {scheme.name}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{scheme.category}</p>
                </div>
              </button>
            );
          })
        )}
      </div>

      <p className="text-[11px] text-subtle mt-3 pt-3 border-t border-default">
        {filtered.length} of {HDFC_SCHEMES.length} schemes
      </p>
    </div>
  );
}
