/**
 * Original geometric logo for FundFacts.
 * A stylized upward growth chart with a leaf-like accent —
 * represents financial information and growth, not a specific brand.
 */

interface LogoProps {
  size?: number;
}

export function Logo({ size = 36 }: LogoProps) {
  return (
    <div
      className="icon-box bg-primary-soft border border-primary/20"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        {/* Upward growth bars */}
        <rect x="3" y="14" width="3.5" height="7" rx="1" fill="currentColor" fillOpacity="0.15" />
        <rect x="10.25" y="9" width="3.5" height="12" rx="1" fill="currentColor" fillOpacity="0.25" />
        <rect x="17.5" y="4" width="3.5" height="17" rx="1" fill="currentColor" fillOpacity="0.35" />
        {/* Leaf accent on tallest bar */}
        <path d="M19.5 4c0-2-1.5-3-1.5-3s1.5 1 3 1.5" fill="none" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
