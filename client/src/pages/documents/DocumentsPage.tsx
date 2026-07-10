import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { documentService } from '@/features/documents/services/document.service';
import { useDeleteDocument } from '@/features/documents/hooks/useDeleteDocument';
import { useFolders } from '@/features/documents/hooks/useFolders';
import { Document } from '@/features/documents/types/document.types';
import WorkspaceSidebar from '@/components/documents/WorkspaceSidebar';

export const DocumentsPage: React.FC = () => {
  const deleteMutation = useDeleteDocument();
  const { data: foldersRes } = useFolders();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'PINNED', 'FAVORITE'
  const [activeFolderId, setActiveFolderId] = useState('ALL'); // 'ALL', 'none', or specific UUID
  const [activeTag, setActiveTag] = useState('ALL');

  // Sorting State
  const [sortBy, setSortBy] = useState<'updatedAt' | 'title'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load documents dynamically from search API
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      if (searchQuery.trim()) {
        filters.query = searchQuery.trim();
      }
      if (activeFilter === 'PINNED') {
        filters.isPinned = 'true';
      }
      if (activeFilter === 'FAVORITE') {
        filters.isFavorite = 'true';
      }
      if (activeFolderId !== 'ALL') {
        filters.folderId = activeFolderId;
      }
      if (activeTag !== 'ALL' && activeTag) {
        filters.tag = activeTag;
      }

      const res = await documentService.searchDocuments(filters, { sortBy, sortOrder });
      setDocuments(res.data || []);
    } catch (err) {
      console.error('Failed to load documents list:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeFilter, activeFolderId, activeTag, sortBy, sortOrder]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document and all its history?')) {
      try {
        await deleteMutation.mutateAsync(id);
        fetchDocuments();
      } catch (err) {
        const error = err as { message?: string };
        alert(error.message || 'Failed to delete document.');
      }
    }
  };

  const handleTogglePin = async (doc: Document) => {
    try {
      await documentService.updateMetadata(doc.id, { isPinned: !doc.isPinned });
      fetchDocuments();
    } catch (err) {
      const error = err as { message?: string };
      alert(error.message || 'Failed to update pin state.');
    }
  };

  const handleToggleFavorite = async (doc: Document) => {
    try {
      await documentService.updateMetadata(doc.id, { isFavorite: !doc.isFavorite });
      fetchDocuments();
    } catch (err) {
      const error = err as { message?: string };
      alert(error.message || 'Failed to update favorite state.');
    }
  };

  const handleMoveToFolder = async (docId: string, folderId: string | null) => {
    try {
      await documentService.updateMetadata(docId, { folderId });
      fetchDocuments();
    } catch (err) {
      const error = err as { message?: string };
      alert(error.message || 'Failed to move document.');
    }
  };

  const handleAddTag = async (doc: Document, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const newTag = input.value.trim();
      if (!newTag) return;
      if (doc.tags.includes(newTag)) {
        input.value = '';
        return;
      }
      const updatedTags = [...doc.tags, newTag];
      try {
        await documentService.updateMetadata(doc.id, { tags: updatedTags });
        input.value = '';
        fetchDocuments();
      } catch (err) {
        const error = err as { message?: string };
        alert(error.message || 'Failed to add tag.');
      }
    }
  };

  const handleRemoveTag = async (doc: Document, tagToRemove: string) => {
    const updatedTags = doc.tags.filter((t) => t !== tagToRemove);
    try {
      await documentService.updateMetadata(doc.id, { tags: updatedTags });
      fetchDocuments();
    } catch (err) {
      const error = err as { message?: string };
      alert(error.message || 'Failed to remove tag.');
    }
  };

  const handleStatusChange = async (docId: string, status: string) => {
    try {
      await documentService.updateMetadata(docId, { status });
      fetchDocuments();
    } catch (err) {
      const error = err as { message?: string };
      alert(error.message || 'Failed to update status.');
    }
  };

  // Compile unique list of tags across all loaded documents
  const allTags = Array.from(new Set(documents.flatMap((d) => d.tags)));
  const folders = foldersRes?.data || [];

  return (
    <div className="flex h-[82vh] border border-slate-900 bg-slate-950/20 rounded-2xl overflow-hidden animate-fade-in select-none">
      {/* Workspace Navigation Sidebar */}
      <WorkspaceSidebar
        activeFolderId={activeFolderId}
        onSelectFolder={(id) => {
          setActiveFolderId(id);
          setActiveFilter('ALL');
        }}
        activeFilter={activeFilter}
        onSelectFilter={(filter) => {
          setActiveFilter(filter);
          setActiveFolderId('ALL');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tags={allTags}
        activeTag={activeTag}
        onSelectTag={setActiveTag}
      />

      {/* Main Workspace List area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950/30">
        {/* Toolbar header */}
        <div className="px-6 py-4 border-b border-slate-900 bg-slate-900/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-white font-display">Document Workspace</h1>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Organize essays, statements of purpose, and portfolios into folder structures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sorting Controls */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-900/60 rounded-lg px-2 h-8 text-xs text-slate-400">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'updatedAt' | 'title')}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="updatedAt">Date Modified</option>
                <option value="title">Alphabetical</option>
              </select>
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="text-slate-300 hover:text-white font-bold pl-1 ml-1 border-l border-slate-800"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            <Link
              to="/documents/sop"
              className="inline-flex items-center justify-center h-8 px-3 rounded-lg text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition-all"
            >
              Generate Draft
            </Link>
          </div>
        </div>

        {/* Documents Grid / List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-20 flex justify-center">
              <svg className="animate-spin h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24">
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
          ) : documents.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-600 mb-3 mx-auto">
                🔍
              </div>
              <h3 className="text-xs font-bold text-slate-400">No matching drafts</h3>
              <p className="text-[11px] text-slate-600 max-w-xs mx-auto mt-1">
                Refine filters in the sidebar directory or compile a new statement of purpose.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 border border-slate-900 bg-slate-900/40 rounded-xl hover:border-slate-850 hover:bg-slate-900/60 transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        {doc.documentType}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Status workflow selector */}
                        <select
                          value={doc.status}
                          disabled={doc.status === 'PENDING' || doc.status === 'GENERATING'}
                          onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                          className={[
                            'text-[9px] font-bold px-2 py-0.5 rounded-full border bg-transparent focus:outline-none cursor-pointer uppercase',
                            doc.status === 'COMPLETED' || doc.status === 'FINAL'
                              ? 'border-emerald-500/20 text-emerald-400'
                              : doc.status === 'GENERATING' || doc.status === 'PENDING'
                                ? 'border-amber-500/20 text-amber-400 animate-pulse'
                                : doc.status === 'ARCHIVED'
                                  ? 'border-slate-800 text-slate-500'
                                  : 'border-brand-500/20 text-brand-400',
                          ].join(' ')}
                        >
                          <option value="DRAFT">DRAFT</option>
                          <option value="REVIEW">REVIEW</option>
                          <option value="FINAL">FINAL</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                          {doc.status === 'PENDING' && <option value="PENDING">PENDING</option>}
                          {doc.status === 'GENERATING' && (
                            <option value="GENERATING">GENERATING</option>
                          )}
                          {doc.status === 'FAILED' && <option value="FAILED">FAILED</option>}
                        </select>

                        {/* Favorite button */}
                        <button
                          onClick={() => handleToggleFavorite(doc)}
                          type="button"
                          className={[
                            'text-xs hover:scale-115 transition-transform',
                            doc.isFavorite ? 'text-red-400' : 'text-slate-600',
                          ].join(' ')}
                          title={doc.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
                        >
                          ♥
                        </button>

                        {/* Pin button */}
                        <button
                          onClick={() => handleTogglePin(doc)}
                          type="button"
                          className={[
                            'text-xs hover:scale-115 transition-transform',
                            doc.isPinned ? 'text-brand-400' : 'text-slate-600',
                          ].join(' ')}
                          title={doc.isPinned ? 'Unpin' : 'Pin Document'}
                        >
                          📌
                        </button>
                      </div>
                    </div>

                    <Link to={`/documents/sop?id=${doc.id}`} className="block">
                      <h3 className="text-sm font-bold text-slate-200 hover:text-white transition-colors truncate">
                        {doc.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span>Version {doc.version}</span>
                      <span>&middot;</span>
                      <span>Edited {new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>

                    {/* Move to folder selector */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
                      <span>Folder:</span>
                      <select
                        value={doc.folderId || 'none'}
                        onChange={(e) =>
                          handleMoveToFolder(
                            doc.id,
                            e.target.value === 'none' ? null : e.target.value
                          )
                        }
                        className="bg-slate-950 border border-slate-900 rounded px-1.5 py-0.5 text-slate-300 focus:outline-none"
                      >
                        <option value="none">Unassigned</option>
                        {folders.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags list inside Card */}
                  <div className="space-y-1.5 border-t border-slate-900/50 pt-3">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-900 text-[9px] text-slate-400 font-semibold"
                        >
                          <span>#{t}</span>
                          <button
                            onClick={() => handleRemoveTag(doc, t)}
                            type="button"
                            className="text-red-400/60 hover:text-red-400 ml-0.5 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      <input
                        type="text"
                        placeholder="+ Add Tag"
                        onKeyDown={(e) => handleAddTag(doc, e)}
                        className="bg-transparent border-none text-[9px] w-14 font-semibold text-slate-500 hover:text-slate-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 border-t border-slate-900/50 pt-3 text-xs">
                    <Link
                      to={`/documents/sop?id=${doc.id}`}
                      className="text-brand-400 hover:text-brand-300 font-bold"
                    >
                      Open Workspace
                    </Link>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      type="button"
                      className="text-slate-600 hover:text-red-400 ml-auto transition-colors font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
