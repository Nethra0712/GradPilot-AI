import React from 'react';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  tier: 'free' | 'premium' | 'pro';
  name: string;
  price: string;
  priceNote?: string;
  description: string;
  features: PricingFeature[];
  ctaLabel: string;
  ctaAction: () => void;
  highlighted?: boolean;
}

/**
 * A pricing comparison card supporting free, premium, and pro tiers.
 * Highlighted cards receive a brand-colored border glow and a "Most Popular" badge.
 */
const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  priceNote,
  description,
  features,
  ctaLabel,
  ctaAction,
  highlighted = false,
}) => {
  return (
    <div
      className={[
        'relative flex flex-col p-7 rounded-2xl border transition-all duration-300',
        highlighted
          ? 'bg-slate-900 border-brand-500/50 shadow-[0_0_40px_rgba(56,85,255,0.15)]'
          : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80',
      ].join(' ')}
    >
      {/* Most Popular badge */}
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-brand-500 text-white shadow-[0_0_12px_rgba(56,85,255,0.5)]">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path
                d="M5 1l1.09 2.26L8.5 3.64l-1.75 1.7.41 2.4L5 6.6 2.84 7.74l.41-2.4L1.5 3.64l2.41-.38L5 1z"
                fill="currentColor"
              />
            </svg>
            Most Popular
          </span>
        </div>
      )}

      {/* Tier header */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          {name}
        </p>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span
            className="text-4xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {price}
          </span>
          {priceNote && <span className="text-sm text-slate-500">{priceNote}</span>}
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>

      {/* CTA button */}
      <button
        type="button"
        onClick={ctaAction}
        className={[
          'w-full h-10 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] mb-6',
          highlighted
            ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-[0_0_16px_rgba(56,85,255,0.35)] hover:shadow-[0_0_24px_rgba(56,85,255,0.5)]'
            : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:border-slate-600',
        ].join(' ')}
      >
        {ctaLabel}
      </button>

      {/* Divider */}
      <div className="divider mb-5" />

      {/* Feature list */}
      <ul className="flex flex-col gap-3" role="list" aria-label={`${name} plan features`}>
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            {feature.included ? (
              <svg
                className="w-4 h-4 text-brand-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="M3 8l3.5 3.5L13 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-slate-700 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
            <span
              className={`text-sm leading-relaxed ${feature.included ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingCard;
