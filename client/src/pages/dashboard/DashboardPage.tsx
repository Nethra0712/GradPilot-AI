import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { calculateProfileCompletion } from '@/features/profile/utils/profileCompletion';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { data: profileData } = useProfile();
  const { data: documentsResponse, isLoading: docsLoading } = useDocuments();

  const mockActivities = [
    { id: 'act-1', text: 'Generated intro paragraph for Stanford SOP', time: '2 hours ago' },
    { id: 'act-2', text: 'Scored MIT CV draft with AI Reviewer (84/100)', time: '1 day ago' },
    { id: 'act-3', text: 'Created MIT PhD Application Academic CV', time: '2 days ago' },
  ];

  // Calculate completion parameters dynamically
  const completion = calculateProfileCompletion(profileData?.profile || null);
  const realDocuments = documentsResponse?.data || [];

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* ─── PROFILE INCOMPLETE WARNING BANNER ─── */}
      {completion.percentage < 80 && (
        <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-amber-500 shrink-0"
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
            <div>
              <h3 className="text-xs font-bold text-amber-400">
                Profile Details Incomplete ({completion.percentage}%)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                AI generation features require at least 80% profile completion.
              </p>
            </div>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center h-8 px-3 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shrink-0 w-fit"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Welcome back, {currentUser?.fullName || 'Student'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is what is happening with your applications today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/documents"
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
          >
            View All Documents
          </Link>
          <Link
            to="/documents/sop"
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition-all shadow-[0_0_16px_rgba(56,85,255,0.3)]"
          >
            New Document
          </Link>
        </div>
      </div>

      {/* ─── METRIC STAT CARDS GRID ─── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Subscription Tier */}
        <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Active Plan
            </span>
            <span className="text-xl font-bold text-white font-display">
              {currentUser?.subscriptionPlan || 'FREE'}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Status: Active</span>
            <Link to="#" className="text-brand-400 hover:text-brand-300 font-semibold">
              Manage Billing
            </Link>
          </div>
        </div>

        {/* Card 2: AI SOP Credits */}
        <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
            AI Generations Used
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-display">2</span>
            <span className="text-xs text-slate-500">/ 15 standard drafts</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-brand-500 rounded-full w-[13%]" />
          </div>
        </div>

        {/* Card 3: Saved Profiles */}
        <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Student Profile
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {completion.percentage}%
              </span>
            </div>
            <span
              className={[
                'text-xl font-bold font-display',
                completion.percentage === 100 ? 'text-emerald-400' : 'text-amber-400',
              ].join(' ')}
            >
              {completion.percentage === 100 ? 'Ready' : 'Incomplete'}
            </span>
          </div>
          <div className="mt-3 text-[10px] text-slate-500 leading-normal">
            <p>
              Completed: {completion.completedSectionsCount}/{completion.totalSectionsCount}{' '}
              sections
            </p>
            <p className="mt-0.5">Updated: {completion.lastUpdated}</p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-slate-900/50">
            <span className="text-slate-600 text-[10px]">
              {completion.remainingSections.length} remaining
            </span>
            <Link to="/profile" className="text-brand-400 hover:text-brand-300 font-semibold">
              {completion.percentage === 100 ? 'View Details' : 'Continue Profile'}
            </Link>
          </div>
        </div>

        {/* Card 4: Total Documents */}
        <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
            Saved Documents
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-display">
              {realDocuments.length}
            </span>
            <span className="text-xs text-slate-500">active drafts</span>
          </div>
          <p className="text-[10px] text-slate-600 mt-4">Soft-deleted items excluded</p>
        </div>
      </div>

      {/* ─── QUICK ACTIONS & RECENT WORK GRID ─── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Documents & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Card */}
          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-display">
              Quick Actions
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                to="/documents/sop"
                className="flex flex-col items-start text-left p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 hover:bg-slate-950/80 transition-all select-none group"
              >
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  Draft Statement of Purpose
                </span>
                <span className="text-[11px] text-slate-500 leading-normal mt-1">
                  Customized for your program
                </span>
              </Link>

              {[
                { title: 'Write Personal Statement', desc: 'Focus on personal history & drive' },
                { title: 'Build Academic CV', desc: 'Generate standard ATS-friendly CV' },
                { title: 'AI Essay Reviewer', desc: 'Score and evaluate existing drafts' },
              ].map((act, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex flex-col items-start text-left p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 hover:bg-slate-950/80 transition-all select-none group opacity-50 cursor-not-allowed"
                >
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {act.title}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-normal mt-1">{act.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Documents Table List */}
          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-display">
                Recent Documents
              </h2>
              <Link
                to="/documents"
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
              >
                See all
              </Link>
            </div>

            {docsLoading ? (
              <div className="py-12 flex justify-center">
                <svg
                  className="animate-spin h-6 w-6 text-brand-500"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </div>
            ) : realDocuments.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-slate-500">No documents created yet.</p>
                <Link
                  to="/documents/sop"
                  className="mt-3 inline-block text-xs text-brand-400 hover:text-brand-300 font-medium underline"
                >
                  Create one now
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-900/50">
                {realDocuments.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    className="py-3 flex items-center justify-between text-sm group"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-200 group-hover:text-white transition-colors truncate">
                        {doc.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {doc.documentType}
                        </span>
                        <span className="text-[10px] text-slate-700">&middot;</span>
                        <span className="text-[10px] text-slate-500">Version {doc.version}</span>
                        <span className="text-[10px] text-slate-700">&middot;</span>
                        <span className="text-[10px] text-slate-500">
                          Updated {new Date(doc.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          'text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border',
                          doc.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse',
                        ].join(' ')}
                      >
                        {doc.status}
                      </span>
                      <Link
                        to={`/documents/${doc.id}`}
                        className="text-xs text-brand-400 hover:text-brand-300 p-1"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Activity Feed */}
        <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-5 h-fit">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-display">
            Recent Activity
          </h2>

          <div className="space-y-4">
            {mockActivities.map((act) => (
              <div key={act.id} className="flex gap-3 text-xs leading-normal">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-300 font-medium">{act.text}</p>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
