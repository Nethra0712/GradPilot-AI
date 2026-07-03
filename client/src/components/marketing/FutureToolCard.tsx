import React from 'react';

interface FutureToolCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
}

/**
 * A card representing a planned future AI tool, with a distinct "Coming Soon" badge.
 * Uses glassmorphism styling on a dark surface.
 */
const FutureToolCard: React.FC<FutureToolCardProps> = ({ icon, name, description }) => {
  return (
    <div className="group relative p-5 rounded-xl border border-slate-800/50 bg-slate-900/30 hover:bg-slate-900/50 hover:border-slate-700/60 transition-all duration-300">
      {/* Subtle inner gradient on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-slate-800/20 to-transparent transition-opacity duration-300 pointer-events-none" />

      <div className="relative flex items-start gap-3.5">
        {/* Icon container */}
        <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 group-hover:text-slate-300 shrink-0 transition-colors duration-200">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3
              className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {name}
            </h3>
            {/* Coming Soon badge */}
            <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-slate-800 border border-slate-700/60 px-1.5 py-0.5 rounded-full whitespace-nowrap">
              Soon
            </span>
          </div>
          <p className="text-xs text-slate-600 group-hover:text-slate-500 leading-relaxed transition-colors duration-200">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FutureToolCard;
