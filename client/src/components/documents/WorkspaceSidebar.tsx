import React, { useState } from 'react';
import {
  useFolders,
  useCreateFolder,
  useDeleteFolder,
} from '@/features/documents/hooks/useFolders';

interface WorkspaceSidebarProps {
  activeFolderId: string;
  onSelectFolder: (id: string) => void;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  tags: string[];
  activeTag: string;
  onSelectTag: (tag: string) => void;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  activeFolderId,
  onSelectFolder,
  activeFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
  tags,
  activeTag,
  onSelectTag,
}) => {
  const { data: foldersRes, isLoading: foldersLoading } = useFolders();
  const createFolderMutation = useCreateFolder();
  const deleteFolderMutation = useDeleteFolder();

  const [newFolderName, setNewFolderName] = useState('');
  const [showAddFolder, setShowAddFolder] = useState(false);

  const folders = foldersRes?.data || [];

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await createFolderMutation.mutateAsync(newFolderName.trim());
      setNewFolderName('');
      setShowAddFolder(false);
    } catch (err) {
      alert('Failed to create folder.');
    }
  };

  const handleDeleteFolder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this folder? Documents inside will be unassigned.')) {
      try {
        await deleteFolderMutation.mutateAsync(id);
        if (activeFolderId === id) {
          onSelectFolder('ALL');
        }
      } catch (err) {
        alert('Failed to delete folder.');
      }
    }
  };

  return (
    <div className="w-64 border-r border-slate-900 bg-slate-950/60 flex flex-col h-full select-none font-sans">
      {/* Search Input */}
      <div className="p-4 border-b border-slate-900">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents..."
            className="w-full h-9 bg-slate-900 border border-slate-900/60 rounded-lg pl-8 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Directory Menu scroll space */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Navigation Filters */}
        <div className="space-y-1">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">
            Workspace
          </h4>
          {[
            { id: 'ALL', label: 'All Drafts', icon: '📄' },
            { id: 'PINNED', label: 'Pinned Items', icon: '📌' },
            { id: 'FAVORITE', label: 'Favorites', icon: '♥' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectFilter(item.id)}
              type="button"
              className={[
                'w-full h-8 px-2.5 rounded-lg flex items-center gap-2.5 text-xs font-semibold transition-all',
                activeFilter === item.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40',
              ].join(' ')}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Folders List */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Folders
            </h4>
            <button
              onClick={() => setShowAddFolder(!showAddFolder)}
              type="button"
              className="text-[10px] text-brand-400 hover:text-brand-300 font-bold"
            >
              + New
            </button>
          </div>

          {showAddFolder && (
            <form onSubmit={handleCreateFolder} className="px-2 py-1.5 flex gap-1 animate-fade-in">
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name..."
                className="flex-1 bg-slate-900 border border-slate-800 text-[11px] h-7 px-2 rounded focus:outline-none text-slate-200"
              />
              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 px-2 h-7 rounded text-[11px] font-bold text-white"
              >
                ✓
              </button>
            </form>
          )}

          {foldersLoading ? (
            <div className="py-2 text-[10px] text-slate-600 italic px-2">Loading folders...</div>
          ) : folders.length === 0 ? (
            <div className="py-2 text-[10px] text-slate-600 italic px-2">No folders added.</div>
          ) : (
            <div className="space-y-0.5">
              <button
                onClick={() => onSelectFolder('none')}
                type="button"
                className={[
                  'w-full h-8 px-2.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-all',
                  activeFolderId === 'none'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40',
                ].join(' ')}
              >
                <div className="flex items-center gap-2.5">
                  <span>📁</span>
                  <span>Unassigned</span>
                </div>
              </button>

              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onSelectFolder(f.id)}
                  type="button"
                  className={[
                    'w-full h-8 px-2.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-all group',
                    activeFolderId === f.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span>📁</span>
                    <span className="truncate">{f.name}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteFolder(f.id, e)}
                    type="button"
                    className="text-[9px] text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0"
                    title="Delete folder"
                  >
                    ✕
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags list */}
        {tags.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">
              Filter by Tags
            </h4>
            <div className="flex flex-wrap gap-1.5 px-2">
              <button
                onClick={() => onSelectTag(activeTag === 'ALL' ? '' : 'ALL')}
                type="button"
                className={[
                  'px-2 py-0.5 rounded text-[10px] font-semibold border transition-all',
                  activeTag === 'ALL' || !activeTag
                    ? 'bg-slate-900 border-slate-800 text-white'
                    : 'bg-transparent border-slate-900 text-slate-500 hover:text-slate-300',
                ].join(' ')}
              >
                All Tags
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSelectTag(activeTag === tag ? 'ALL' : tag)}
                  type="button"
                  className={[
                    'px-2 py-0.5 rounded text-[10px] font-semibold border transition-all',
                    activeTag === tag
                      ? 'bg-brand-500/10 border-brand-500/20 text-brand-400 font-bold'
                      : 'bg-transparent border-slate-900/60 text-slate-400 hover:text-slate-300',
                  ].join(' ')}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceSidebar;
