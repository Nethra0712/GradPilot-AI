import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Standard layout shell for public marketing page templates.
 */
export const MarketingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Premium Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              GradPilot AI
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              MVP Foundation
            </span>
          </nav>
        </div>
      </header>

      {/* Page Content Area */}
      <main className="flex-grow flex items-center justify-center">
        <Outlet />
      </main>

      {/* Footer Details */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} GradPilot AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
