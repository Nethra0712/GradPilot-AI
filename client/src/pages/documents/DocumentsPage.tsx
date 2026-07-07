import React, { useState } from 'react';

export const DocumentsPage: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'SOP' | 'CV' | 'STATEMENT'>('ALL');

  const mockDocs = [
    {
      id: '1',
      title: 'Statement of Purpose - Stanford MSCS',
      type: 'SOP',
      status: 'DRAFT',
      date: '2 hours ago',
    },
    {
      id: '2',
      title: 'Academic CV - MIT PhD Application',
      type: 'CV',
      status: 'FINAL',
      date: '2 days ago',
    },
    {
      id: '3',
      title: 'Personal Statement - UC Berkeley',
      type: 'STATEMENT',
      status: 'DRAFT',
      date: '3 days ago',
    },
    {
      id: '4',
      title: 'Statement of Purpose - Carnegie Mellon',
      type: 'SOP',
      status: 'DRAFT',
      date: '1 week ago',
    },
  ];

  const filteredDocs = filter === 'ALL' ? mockDocs : mockDocs.filter((d) => d.type === filter);

  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            My Documents
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your generated statements of purpose, CVs, and letters.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition-all"
        >
          New Document
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 select-none scrollbar-none">
        {(['ALL', 'SOP', 'CV', 'STATEMENT'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            type="button"
            className={[
              'h-8 px-3 rounded-lg text-xs font-semibold border transition-all shrink-0',
              filter === type
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-transparent border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800',
            ].join(' ')}
          >
            {type === 'ALL' ? 'All Formats' : type}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 border border-slate-900 bg-slate-900/40 rounded-2xl hover:border-slate-800 hover:bg-slate-900/60 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {doc.type}
                </span>
                <span
                  className={[
                    'text-[9px] font-bold px-2 py-0.5 rounded-full border',
                    doc.status === 'FINAL'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                  ].join(' ')}
                >
                  {doc.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2">Edited {doc.date}</p>
            </div>

            <div className="flex gap-3 border-t border-slate-900/50 mt-5 pt-3 text-xs">
              <button type="button" className="text-brand-400 hover:text-brand-300 font-semibold">
                Open Editor
              </button>
              <button type="button" className="text-slate-500 hover:text-slate-300">
                Rename
              </button>
              <button type="button" className="text-slate-600 hover:text-red-400 ml-auto">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsPage;
