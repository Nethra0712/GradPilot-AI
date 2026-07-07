import React from 'react';

interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-950/80 to-slate-950 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-6">
        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto shadow-md">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-white font-display">
            Something went wrong
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            An unexpected error occurred in the application. We apologize for the inconvenience.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-slate-900 bg-slate-950 text-left font-mono text-[10px] text-slate-400 max-h-40 overflow-y-auto select-text">
            <p className="font-semibold text-slate-300 mb-1">Error Details:</p>
            <p className="break-all whitespace-pre-wrap">{error.message}</p>
            {error.stack && <p className="text-slate-600 mt-2">{error.stack}</p>}
          </div>
        )}

        <div className="pt-2 flex gap-3 justify-center">
          <button
            onClick={handleReload}
            type="button"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition-all shadow-lg"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-slate-200 transition-all"
          >
            Go to Landing Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
