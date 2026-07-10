import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { useDeleteDocument } from '@/features/documents/hooks/useDeleteDocument';
import { DocumentType } from '@/features/documents/types/document.types';

export const DocumentsPage: React.FC = () => {
  const { data: documentsResponse, isLoading, refetch } = useDocuments();
  const deleteMutation = useDeleteDocument();
  const [filter, setFilter] = useState<'ALL' | DocumentType>('ALL');

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document and all its history?')) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (err) {
        const error = err as Error;
        alert(error.message || 'Failed to delete document.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24">
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
    );
  }

  const documents = documentsResponse?.data || [];
  const filteredDocs =
    filter === 'ALL' ? documents : documents.filter((d) => d.documentType === filter);

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            My Documents
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your generated statements of purpose, CVs, and essays.
          </p>
        </div>
        <Link
          to="/documents/sop"
          className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition-all w-fit"
        >
          New Document
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 select-none scrollbar-none">
        {(['ALL', 'SOP', 'PERSONAL_STATEMENT', 'CV'] as const).map((type) => (
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
            {type === 'ALL' ? 'All Formats' : type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Documents Grid / Empty State */}
      {filteredDocs.length === 0 ? (
        <div className="p-8 border border-slate-900 bg-slate-900/10 rounded-2xl flex flex-col justify-center items-center py-32 text-center">
          <div className="w-12 h-12 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mb-4">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-300">No Documents Found</h3>
          <p className="text-xs text-slate-500 max-w-xs mt-1 leading-normal">
            {filter === 'ALL'
              ? 'Get started by creating your first AI Statement of Purpose draft.'
              : `No documents generated for type "${filter}".`}
          </p>
          {filter === 'ALL' && (
            <Link
              to="/documents/sop"
              className="mt-4 inline-flex items-center justify-center h-9 px-4 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 transition-all"
            >
              Generate SOP
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 border border-slate-900 bg-slate-900/40 rounded-2xl hover:border-slate-800 hover:bg-slate-900/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {doc.documentType}
                  </span>
                  <span
                    className={[
                      'text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase',
                      doc.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : doc.status === 'GENERATING' || doc.status === 'PENDING'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                          : 'bg-red-500/10 border-red-500/20 text-red-400',
                    ].join(' ')}
                  >
                    {doc.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                  {doc.title}
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2 font-medium">
                  <span>Version {doc.version}</span>
                  <span>&middot;</span>
                  <span>Edited {new Date(doc.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-900/50 mt-5 pt-3 text-xs">
                <Link
                  to={`/documents/${doc.id}`}
                  className="text-brand-400 hover:text-brand-300 font-semibold"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(doc.id)}
                  type="button"
                  className="text-slate-600 hover:text-red-400 ml-auto transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
