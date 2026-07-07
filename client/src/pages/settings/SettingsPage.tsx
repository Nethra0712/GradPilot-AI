import React from 'react';
import { useAuth } from '@/context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-display">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your login credentials, subscription plans, and active session tokens.
        </p>
      </div>

      <div className="space-y-4">
        {/* Section 1: User details */}
        <div className="p-6 border border-slate-900 bg-slate-900/40 rounded-2xl">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-display">
            Personal Details
          </h2>
          <div className="space-y-4 text-xs">
            <div className="grid md:grid-cols-3">
              <span className="text-slate-500 font-medium">Full Name</span>
              <span className="md:col-span-2 text-slate-300">{currentUser?.fullName}</span>
            </div>
            <div className="grid md:grid-cols-3 border-t border-slate-900 pt-4">
              <span className="text-slate-500 font-medium">Email Address</span>
              <span className="md:col-span-2 text-slate-300">{currentUser?.email}</span>
            </div>
            <div className="grid md:grid-cols-3 border-t border-slate-900 pt-4">
              <span className="text-slate-500 font-medium">Unique Identity ID</span>
              <span className="md:col-span-2 text-slate-500 font-mono select-all truncate">
                {currentUser?.id}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Security */}
        <div className="p-6 border border-slate-900 bg-slate-900/40 rounded-2xl">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-display">
            Security Controls
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs py-1">
              <div>
                <p className="text-slate-300 font-medium">Update Password</p>
                <p className="text-slate-500 text-[10px]">
                  Change your current dashboard password.
                </p>
              </div>
              <button
                type="button"
                className="h-8 px-3 rounded-lg border border-slate-900 hover:border-slate-800 text-[10px] font-semibold text-slate-400 hover:text-slate-200 transition-all shrink-0"
              >
                Change Password
              </button>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-900 pt-3 py-1">
              <div>
                <p className="text-slate-300 font-medium">Two-Factor Authentication</p>
                <p className="text-slate-500 text-[10px]">
                  Add an extra layer of security using an authenticator app.
                </p>
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded-full shrink-0">
                COMING SOON
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
