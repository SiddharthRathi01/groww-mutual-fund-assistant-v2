import { FeatureIndicators } from '@/components/FeatureIndicators';
import { Logo } from '@/components/Logo';

export function Hero() {
  return (
    <section className="pt-3 pb-2 sm:pt-4 sm:pb-3">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-start">
        {/* Left — heading and supporting text */}
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase mb-3">
            Mutual Fund Facts, Simplified.
          </p>
          <div className="flex items-center gap-2.5 mb-2.5">
            <Logo size={26} />
            <h1
              className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] leading-[1.2]"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              <span className="text-[rgb(var(--color-text))]">HDFC </span>
              <span className="text-primary">Mutual Fund</span>
              <span className="text-[rgb(var(--color-text))]"> Assistant</span>
            </h1>
          </div>
          <p className="text-sm text-muted leading-relaxed max-w-lg">
            Get concise answers grounded in verified mutual fund sources.
          </p>
        </div>

        {/* Right — feature indicators */}
        <div className="lg:w-[340px]">
          <FeatureIndicators />
        </div>
      </div>
    </section>
  );
}
