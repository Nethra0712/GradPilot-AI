import React from 'react';

/**
 * Simple, high-quality Coming Soon page.
 * Displays only the required project identification content.
 */
export const LandingPage: React.FC = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-16 flex flex-col items-center text-center overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Required Text Blocks */}
      <h1
        className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        GradPilot AI
      </h1>

      <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mb-8 leading-relaxed font-light">
        AI-powered University Application Assistant
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur text-sm text-brand-400 font-semibold uppercase tracking-widest animate-pulse">
        Coming Soon
      </div>
    </div>
  );
};

export default LandingPage;
