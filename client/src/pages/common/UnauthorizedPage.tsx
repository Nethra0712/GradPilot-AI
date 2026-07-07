import React from 'react';
import { Link } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-950/80 to-slate-950 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-5">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-md">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m0-6v4m0-6a9 9 0 110 18 9 9 0 010-18z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Access Denied
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            You do not have the required permissions or role configurations to view this page.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition-all shadow-lg"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
