import React, { useState, useEffect, useCallback } from 'react';
import { documentService } from '@/features/documents/services/document.service';
import { Document } from '@/features/documents/types/document.types';
import { calculateStringDiff, DiffSegment } from '@/utils/diff';

interface CompareDialogProps {
  documentId: string;
  activeText: string;
  onClose: () => void;
}

export const CompareDialog: React.FC<CompareDialogProps> = ({
  documentId,
  activeText,
  onClose,
}) => {
  const [versions, setVersions] = useState<Document[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const [diffSegments, setDiffSegments] = useState<DiffSegment[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingText, setLoadingText] = useState(false);

  // Load versions list page on demand
  const loadVersionsPage = useCallback(
    async (pageNum: number) => {
      setLoadingHistory(true);
      try {
        const response = await documentService.getHistory(documentId, pageNum, 5);
        const newVersions = response.data || [];

        setVersions((prev) => {
          const merged = [...prev];
          newVersions.forEach((v) => {
            if (!merged.some((m) => m.id === v.id)) {
              merged.push(v);
            }
          });
          return merged;
        });

        setHasMore(response.metadata.total > pageNum * 5);
        setPage(pageNum);

        // Auto-select first non-active history item if not selected
        if (newVersions.length > 0 && !selectedVersionId) {
          const firstHistory = newVersions.find((v) => v.content?.text !== activeText);
          if (firstHistory) {
            setSelectedVersionId(firstHistory.id);
          } else {
            setSelectedVersionId(newVersions[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load version history page:', err);
      } finally {
        setLoadingHistory(false);
      }
    },
    [documentId, activeText, selectedVersionId]
  );

  useEffect(() => {
    loadVersionsPage(1);
  }, [documentId, loadVersionsPage]);

  // Load selected text and calculate differences
  useEffect(() => {
    if (!selectedVersionId) return;

    const fetchSelectedVersionContent = async () => {
      setLoadingText(true);
      try {
        const docRes = await documentService.getDocument(selectedVersionId);
        const textVal = docRes.data?.content?.text || '';
        setSelectedText(textVal);

        // Diff activeText (current) vs target version
        const segments = calculateStringDiff(textVal, activeText);
        setDiffSegments(segments);
      } catch (err) {
        console.error('Failed to resolve target version:', err);
      } finally {
        setLoadingText(false);
      }
    };

    fetchSelectedVersionContent();
  }, [selectedVersionId, activeText]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm select-none p-4 animate-fade-in">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[80vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Version Comparison Workspace
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Highlighting modifications between the current draft and archived checkpoints.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {/* Selection bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">
              Compare Current Draft with:
            </span>
            <select
              value={selectedVersionId}
              onChange={(e) => setSelectedVersionId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 h-8 text-slate-200 focus:outline-none"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  Version {v.version} ({v.generatedBy === 'AI' ? 'AI Generated' : 'User Edited'}) -{' '}
                  {new Date(v.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
            {hasMore && (
              <button
                type="button"
                onClick={() => loadVersionsPage(page + 1)}
                disabled={loadingHistory}
                className="text-[10px] text-brand-400 hover:text-brand-300 font-bold underline disabled:opacity-50"
              >
                {loadingHistory ? 'Loading...' : 'Load more versions'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-wider text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500/25 border border-emerald-500/50 rounded" />
              <span className="text-emerald-400">Added text</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-500/25 border border-red-500/50 rounded" />
              <span className="text-red-400">Removed text</span>
            </div>
          </div>
        </div>

        {/* Comparison Views */}
        <div className="flex-1 grid md:grid-cols-2 divide-x divide-slate-800 overflow-hidden">
          {/* Target Reference Version */}
          <div className="flex flex-col overflow-hidden">
            <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Reference Version
            </div>
            <div className="p-5 overflow-y-auto flex-1 font-sans text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {loadingText ? (
                <div className="flex items-center justify-center h-full">
                  <svg
                    className="animate-spin h-5 w-5 text-slate-500"
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
              ) : (
                selectedText || <span className="italic text-slate-600">No content loaded.</span>
              )}
            </div>
          </div>

          {/* Diff Marked Visualizer */}
          <div className="flex flex-col overflow-hidden">
            <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Visual Modifications
            </div>
            <div className="p-5 overflow-y-auto flex-1 font-sans text-sm leading-relaxed whitespace-pre-wrap">
              {loadingText ? (
                <div className="flex items-center justify-center h-full">
                  <svg
                    className="animate-spin h-5 w-5 text-slate-500"
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
              ) : diffSegments.length === 0 ? (
                <span className="italic text-slate-600">No differences detected.</span>
              ) : (
                <div className="text-slate-300">
                  {diffSegments.map((seg, idx) => {
                    if (seg.type === 'added') {
                      return (
                        <span
                          key={idx}
                          className="bg-emerald-500/10 border-b border-emerald-500/25 text-emerald-400 px-0.5 rounded font-medium"
                        >
                          {seg.value}
                        </span>
                      );
                    }
                    if (seg.type === 'removed') {
                      return (
                        <span
                          key={idx}
                          className="bg-red-500/10 border-b border-red-500/25 text-red-400 line-through px-0.5 rounded opacity-60"
                        >
                          {seg.value}
                        </span>
                      );
                    }
                    return <span key={idx}>{seg.value}</span>;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareDialog;
