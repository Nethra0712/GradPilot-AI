import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
}

/**
 * A reusable feature card displaying an icon, title, description, and optional tag.
 * Features a subtle border glow on hover using CSS transitions.
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, tag }) => {
  return (
    <div className="group relative p-6 rounded-2xl border border-slate-800/60 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700/80 transition-all duration-300 overflow-hidden">
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 group-hover:bg-brand-500/15 group-hover:border-brand-500/30 transition-all duration-300">
          {icon}
        </div>

        {/* Tag */}
        {tag && (
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full mb-3">
            {tag}
          </span>
        )}

        {/* Title */}
        <h3
          className="text-[15px] font-semibold text-white mb-2 leading-snug"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
