import React from 'react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-display">
          Academic Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your academic background, achievements, and target schools.
        </p>
      </div>

      <div className="p-5 border border-slate-900 bg-slate-900/40 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Sprint 6 Preview</h2>
            <p className="text-xs text-slate-500">
              Interactive questionnaire controls and profile state persistence will be implemented
              in the next sprint.
            </p>
          </div>
        </div>

        {/* Read-Only Academic Mock Data */}
        <div className="space-y-4 text-sm mt-6">
          <div className="grid md:grid-cols-3 py-3 border-t border-slate-900">
            <span className="text-slate-500 font-medium">Academic Background</span>
            <span className="md:col-span-2 text-slate-300">
              Bachelor of Science in Computer Science & Engineering. GPA 3.84/4.0.
            </span>
          </div>

          <div className="grid md:grid-cols-3 py-3 border-t border-slate-900">
            <span className="text-slate-500 font-medium">Key Achievements</span>
            <div className="md:col-span-2 space-y-1">
              {[
                'Dean Honored List (all semesters)',
                '1st place at University AI Hackathon',
                'Co-authored a paper on lightweight transformer models',
              ].map((ach, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 py-3 border-t border-slate-900">
            <span className="text-slate-500 font-medium">Target Countries</span>
            <span className="md:col-span-2 text-slate-300">
              United States, Canada, United Kingdom
            </span>
          </div>

          <div className="grid md:grid-cols-3 py-3 border-t border-slate-900">
            <span className="text-slate-500 font-medium">Career Goals</span>
            <span className="md:col-span-2 text-slate-300">
              PhD research in AI safety or NLP, leading to a research engineering career at a
              top-tier laboratory.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
