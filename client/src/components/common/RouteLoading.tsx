import React from 'react';

/**
 * Premium fullscreen loading spinner.
 * Shown when checking or restoring the user's session.
 */
export const RouteLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-950/80 to-slate-950 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        {/* Brand Mark */}
        <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center shadow-[0_0_24px_rgba(56,85,255,0.4)] animate-pulse">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M8 5.5L11 7.25V10.75L8 12.5L5 10.75V7.25L8 5.5Z"
              fill="white"
              fillOpacity="0.4"
            />
          </svg>
        </div>

        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-widest font-display">
            GradPilot AI
          </h2>
          <p className="text-xs text-slate-500">Restoring session...</p>
        </div>

        {/* Minimal loading bar */}
        <div className="w-24 h-1 bg-slate-900 rounded-full overflow-hidden mt-2 border border-slate-800/40">
          <div className="h-full bg-brand-500 rounded-full animate-shimmer w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default RouteLoading;
