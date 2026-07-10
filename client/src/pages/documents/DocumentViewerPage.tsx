import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDocument } from '@/features/documents/hooks/useDocument';

export const DocumentViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: documentResponse, isLoading, error } = useDocument(id || '');

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

  if (error || !documentResponse?.data) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-sm text-red-400 font-medium">
          Failed to retrieve document or unauthorized access.
        </p>
        <Link to="/documents" className="text-xs text-brand-400 hover:underline">
          Return to Documents list
        </Link>
      </div>
    );
  }

  const doc = documentResponse.data;
  const wordCount = doc.content?.text ? doc.content.text.split(/\s+/).filter(Boolean).length : 0;
  const charCount = doc.content?.text ? doc.content.text.length : 0;
  const formattedDate = new Date(doc.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Custom parser to map markdown blocks into clean styled elements
  const renderTextAsHtml = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      const cleanLine = line.trim();
      if (cleanLine.startsWith('###')) {
        return (
          <h4 key={idx} className="text-base font-bold text-slate-100 mt-4 mb-2">
            {cleanLine.replace('###', '').trim()}
          </h4>
        );
      }
      if (cleanLine.startsWith('##')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-slate-100 mt-5 mb-2">
            {cleanLine.replace('##', '').trim()}
          </h3>
        );
      }
      if (cleanLine.startsWith('#')) {
        return (
          <h2 key={idx} className="text-xl font-bold text-white mt-6 mb-3">
            {cleanLine.replace('#', '').trim()}
          </h2>
        );
      }
      if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
        return (
          <li key={idx} className="text-slate-300 ml-4 list-disc text-sm my-1 leading-relaxed">
            {cleanLine.substring(1).trim()}
          </li>
        );
      }
      return cleanLine ? (
        <p key={idx} className="text-slate-300 text-sm leading-relaxed mb-3">
          {cleanLine}
        </p>
      ) : (
        <div key={idx} className="h-2" />
      );
    });
  };

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* HEADER */}
      <div className="border-b border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display truncate max-w-xl">
            {doc.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Read-only preview. Structured formatting compiled on {formattedDate}.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/documents"
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-all w-fit"
          >
            List Documents
          </Link>
          <select
            onChange={(e) => {
              if (e.target.value) {
                alert(`Mock export file downloaded in ${e.target.value} format!`);
                e.target.value = '';
              }
            }}
            className="px-3 h-10 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all focus:outline-none"
          >
            <option value="">Export file</option>
            <option value="PDF">As PDF</option>
            <option value="DOCX">As Word (DOCX)</option>
            <option value="TXT">As Text (TXT)</option>
          </select>
        </div>
      </div>

      {/* METADATA DASHBOARD GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 border border-slate-900 bg-slate-900/20 rounded-2xl">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
            Document Type
          </span>
          <span className="text-sm font-semibold text-slate-200">{doc.documentType}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
            Active Version
          </span>
          <span className="text-sm font-semibold text-slate-200">v{doc.version}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
            Provider Model
          </span>
          <span className="text-sm font-semibold text-brand-400 uppercase truncate block">
            {doc.provider || 'N/A'} ({doc.model || 'N/A'})
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
            Word Count
          </span>
          <span className="text-sm font-semibold text-slate-200">
            {wordCount} words ({charCount} chars)
          </span>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CARD */}
      <div className="p-8 border border-slate-900 bg-slate-950/40 rounded-2xl font-sans min-h-[500px]">
        {doc.content?.text ? (
          <div className="prose prose-invert max-w-none">{renderTextAsHtml(doc.content.text)}</div>
        ) : (
          <p className="text-xs text-slate-600 italic">No text content generated yet.</p>
        )}
      </div>

      {/* VERSION ARCHIVE LOGS */}
      {doc.children && doc.children.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Version History Archive
          </h3>
          <div className="divide-y divide-slate-900 border border-slate-900 bg-slate-900/10 rounded-2xl overflow-hidden">
            {doc.children.map((child) => (
              <div
                key={child.id}
                className="p-4 flex items-center justify-between text-xs hover:bg-slate-900/20 transition-all"
              >
                <div>
                  <span className="font-semibold text-slate-200 block">
                    Version {child.version}
                  </span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">
                    Generated on {new Date(child.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 uppercase text-[9px]">
                    {child.provider} ({child.model})
                  </span>
                  <Link
                    to={`/documents/${child.id}`}
                    className="text-brand-400 hover:text-brand-300 font-semibold"
                  >
                    View Version
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewerPage;
