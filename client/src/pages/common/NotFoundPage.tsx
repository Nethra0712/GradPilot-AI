import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-950/80 to-slate-950 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-5">
        <span className="text-5xl font-extrabold text-slate-800 font-display tracking-tight block">
          404
        </span>

        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-white font-display">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            The page you are looking for does not exist or has been moved to a new location.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition-all shadow-lg"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
