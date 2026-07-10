import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useGenerateSop } from '@/features/documents/hooks/useGenerateSop';
import { useRegenerateSop } from '@/features/documents/hooks/useRegenerateSop';
import { documentService } from '@/features/documents/services/document.service';
import { Document } from '@/features/documents/types/document.types';

// Workspace Components
import DocumentEditor from '@/components/editor/DocumentEditor';
import CompareDialog from '@/components/documents/CompareDialog';
import ActivityTimeline from '@/components/documents/ActivityTimeline';
import AIAnalyticsPanel from '@/components/documents/AIAnalyticsPanel';

const STEPS = [
  { id: 'validating', label: 'Validating Profile Details' },
  { id: 'compiling', label: 'Compiling Variables & Templates' },
  { id: 'generating', label: 'Running AI Engine Pipeline' },
  { id: 'saving', label: 'Writing Records to Database' },
];

export const SOPGeneratorPage: React.FC = () => {
  const { data: profileData } = useProfile();
  const generateMutation = useGenerateSop();
  const regenerateMutation = useRegenerateSop();
  const [searchParams, setSearchParams] = useSearchParams();

  const docIdQuery = searchParams.get('id');

  // Generator Options State
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState<'OPENAI' | 'CLAUDE' | 'GEMINI'>('OPENAI');
  const [feedback, setFeedback] = useState('');
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);

  // Stepper state
  const [stepIndex, setStepIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState('');

  // Tabs for right side sidebar panel
  const [activeTab, setActiveTab] = useState<'history' | 'timeline' | 'ai' | 'meta'>('meta');
  const [versions, setVersions] = useState<Document[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);

  // Comparison Dialog Overlay
  const [showCompare, setShowCompare] = useState(false);

  // Load existing document if UUID query is present
  const fetchActiveDocument = useCallback(async (id: string) => {
    try {
      const res = await documentService.getDocument(id);
      setActiveDocument(res.data);
      setErrorMsg('');
    } catch (err) {
      console.error('Failed to load active workspace document:', err);
      setErrorMsg('Failed to load document or unauthorized access.');
    }
  }, []);

  useEffect(() => {
    if (docIdQuery) {
      fetchActiveDocument(docIdQuery);
    } else {
      setActiveDocument(null);
    }
  }, [docIdQuery, fetchActiveDocument]);

  // Load version history paginated list
  const loadHistoryPage = useCallback(
    async (pageNum: number) => {
      if (!activeDocument) return;
      setLoadingHistory(true);
      try {
        const res = await documentService.getHistory(activeDocument.id, pageNum, 5);
        const newItems = res.data || [];
        setVersions((prev) => {
          if (pageNum === 1) return newItems;
          const merged = [...prev];
          newItems.forEach((item) => {
            if (!merged.some((m) => m.id === item.id)) {
              merged.push(item);
            }
          });
          return merged;
        });
        setHasMoreHistory(res.metadata.total > pageNum * 5);
        setHistoryPage(pageNum);
      } catch (err) {
        console.error('Failed to load history page:', err);
      } finally {
        setLoadingHistory(false);
      }
    },
    [activeDocument]
  );

  useEffect(() => {
    if (activeDocument?.id) {
      loadHistoryPage(1);
    }
  }, [activeDocument?.id, loadHistoryPage]);

  // Auto-fill defaults
  useEffect(() => {
    if (profileData?.profile) {
      const university =
        Array.isArray(profileData.profile.targetUniversities) &&
        profileData.profile.targetUniversities.length > 0
          ? profileData.profile.targetUniversities[0]
          : '';
      const degree = profileData.profile.targetDegree || '';

      const parts = [];
      if (degree) parts.push(degree);
      if (university) parts.push(university);

      setTitle(parts.length > 0 ? `SOP - ${parts.join(' - ')}` : 'Statement of Purpose');
    }
  }, [profileData]);

  // Check profile fields locally
  const checkProfileFields = () => {
    const required = [
      { key: 'nationality', label: 'Nationality' },
      { key: 'currentEducation', label: 'Current Education Level' },
      { key: 'institution', label: 'Current Institution' },
      { key: 'targetDegree', label: 'Target Degree' },
      { key: 'targetUniversities', label: 'Target Universities' },
    ];

    const missing: string[] = [];
    if (!profileData?.profile) {
      return required.map((r) => r.label);
    }

    required.forEach((f) => {
      const profileObj = profileData.profile as unknown as Record<string, unknown>;
      const val = profileObj[f.key];
      if (val === null || val === undefined || val === '') {
        missing.push(f.label);
      } else if (Array.isArray(val) && val.length === 0) {
        missing.push(f.label);
      }
    });

    return missing;
  };

  const handleGenerate = async () => {
    setErrorMsg('');

    const missing = checkProfileFields();
    if (missing.length > 0) return;

    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex((idx) => {
        if (idx < 2) return idx + 1;
        clearInterval(interval);
        return idx;
      });
    }, 900);

    try {
      const result = await generateMutation.mutateAsync({
        title,
        provider,
        customVariables: {},
      });

      clearInterval(interval);
      setStepIndex(3);

      setTimeout(() => {
        setActiveDocument(result.data);
        setStepIndex(-1);
        setSearchParams({ id: result.data.id });
      }, 600);
    } catch (err) {
      clearInterval(interval);
      setStepIndex(-1);
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(error.response?.data?.message || error.message || 'Generation failed.');
    }
  };

  const handleRegenerate = async () => {
    if (!activeDocument || !feedback.trim()) return;
    setErrorMsg('');

    setStepIndex(2);

    try {
      const result = await regenerateMutation.mutateAsync({
        documentId: activeDocument.id,
        feedbackInstructions: feedback,
        provider,
      });

      setStepIndex(3);

      setTimeout(() => {
        setActiveDocument(result.data);
        setStepIndex(-1);
        setFeedback('');
        // Load target details using newest query
        fetchActiveDocument(result.data.id);
      }, 600);
    } catch (err) {
      setStepIndex(-1);
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(error.response?.data?.message || error.message || 'Regeneration failed.');
    }
  };

  // Save manual text edits
  const handleSaveText = async (text: string) => {
    if (!activeDocument) return;
    try {
      const res = await documentService.saveEdits(activeDocument.id, text);
      // If saving forks the document (which returns a new UUID), update current workspace context
      if (res.data.id !== activeDocument.id) {
        setActiveDocument(res.data);
        setSearchParams({ id: res.data.id });
      } else {
        setActiveDocument(res.data);
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(error.response?.data?.message || error.message || 'Save failed.');
    }
  };

  // Restore history version
  const handleRestoreVersion = async (versionId: string) => {
    if (!activeDocument) return;
    if (!window.confirm('Restore document content to this version?')) return;
    try {
      const res = await documentService.restoreVersion(activeDocument.id, versionId);
      setActiveDocument(res.data);
      setSearchParams({ id: res.data.id });
      loadHistoryPage(1);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      alert(error.response?.data?.message || error.message || 'Restoration failed.');
    }
  };

  const handleExportMarkdown = () => {
    if (!activeDocument) return;
    // Redirect browser directly to export download endpoint
    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/documents/${activeDocument.id}/export?token=${token || ''}`;
    window.open(url, '_blank');
  };

  const isGenerating = stepIndex !== -1;
  const missingLocalFields = checkProfileFields();

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 h-full">
      {/* HEADER */}
      <div className="border-b border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            {activeDocument ? activeDocument.title : 'Statement of Purpose Generator'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {activeDocument
              ? `Workspace workspace for draft v${activeDocument.version}`
              : 'Build bespoke Statement of Purpose outlines structured for your applications.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/documents"
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-all w-fit"
          >
            Back to Workspace
          </Link>
          {activeDocument && (
            <button
              onClick={handleExportMarkdown}
              type="button"
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-all w-fit shadow-[0_0_16px_rgba(56,85,255,0.3)]"
            >
              Export Markdown
            </button>
          )}
        </div>
      </div>

      {/* WARNING CARD: Profile Incomplete */}
      {missingLocalFields.length > 0 && !activeDocument && !isGenerating && (
        <div className="p-6 border border-amber-500/20 bg-amber-500/5 rounded-2xl space-y-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
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
              <h3 className="text-sm font-bold text-amber-400">Complete Profile Required</h3>
              <p className="text-xs text-slate-400 mt-1">
                AI document generation requires detailed context. Please populate the following
                fields first:
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {missingLocalFields.map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-2">
            <Link
              to="/profile"
              className="inline-flex items-center justify-center h-9 px-4 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all"
            >
              Configure Profile
            </Link>
          </div>
        </div>
      )}

      {/* WORKSPACE PANELS CONTAINER */}
      {!activeDocument && !isGenerating ? (
        // Initial Options Page
        <div className="max-w-2xl mx-auto p-6 border border-slate-900 bg-slate-900/40 rounded-2xl space-y-5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-display">
            Generation Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. Stanford MSCS SOP"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                AI Provider Engine
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as 'OPENAI' | 'CLAUDE' | 'GEMINI')}
                className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="OPENAI">OpenAI GPT-4o (Standard)</option>
                <option value="CLAUDE">Claude 3.5 Sonnet (Creative)</option>
                <option value="GEMINI">Google Gemini Pro (Analytical)</option>
              </select>
            </div>

            {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={missingLocalFields.length > 0}
              className="w-full h-11 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(56,85,255,0.3)]"
            >
              Compile & Generate SOP
            </button>
          </div>
        </div>
      ) : isGenerating ? (
        // Progress Stepper Loader
        <div className="max-w-2xl mx-auto p-8 border border-slate-900 bg-slate-900/20 rounded-2xl flex flex-col justify-center items-center py-20 space-y-8">
          <svg className="animate-spin h-10 w-10 text-brand-500" fill="none" viewBox="0 0 24 24">
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

          <div className="w-full max-w-xs space-y-4">
            {STEPS.map((step, idx) => {
              const isActive = STEPS[stepIndex]?.id === step.id;
              const isFinished = idx < stepIndex;
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div
                    className={[
                      'w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border transition-colors shrink-0',
                      isFinished
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : isActive
                          ? 'bg-brand-500 border-brand-500 text-white animate-pulse'
                          : 'bg-transparent border-slate-800 text-slate-600',
                    ].join(' ')}
                  >
                    {isFinished ? '✓' : ''}
                  </div>
                  <span
                    className={[
                      'text-xs font-medium transition-colors',
                      isFinished ? 'text-slate-400' : isActive ? 'text-white' : 'text-slate-600',
                    ].join(' ')}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Workspace Grid: Reusable Editor + Sidebar Controls (Notion/Linear Inspired)
        <div className="grid lg:grid-cols-5 gap-6 h-[65vh]">
          {/* Reusable Editor panel (3/5 columns) */}
          <div className="lg:col-span-3 h-full">
            {activeDocument && (
              <DocumentEditor
                document={activeDocument}
                onSave={handleSaveText}
                isReadOnly={
                  activeDocument.status === 'PENDING' || activeDocument.status === 'GENERATING'
                }
              />
            )}
          </div>

          {/* Collapsible tab sheet controls panel (2/5 columns) */}
          <div className="lg:col-span-2 border border-slate-900 bg-slate-900/20 rounded-2xl flex flex-col h-full overflow-hidden shadow-2xl">
            {/* Tabs List */}
            <div className="flex border-b border-slate-900 bg-slate-900/40 text-[10px] font-bold uppercase tracking-wider select-none shrink-0 overflow-x-auto scrollbar-none">
              {[
                { id: 'meta', label: 'Meta' },
                { id: 'history', label: 'History' },
                { id: 'timeline', label: 'Timeline' },
                { id: 'ai', label: 'AI Cost' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'meta' | 'history' | 'timeline' | 'ai')}
                  type="button"
                  className={[
                    'flex-1 py-3 text-center border-b-2 transition-all shrink-0 px-2',
                    activeTab === tab.id
                      ? 'border-brand-500 text-white bg-slate-900/25'
                      : 'border-transparent text-slate-500 hover:text-slate-300',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content area */}
            <div className="flex-1 p-5 overflow-y-auto">
              {/* TAB 1: Meta Settings & AI Regeneration */}
              {activeTab === 'meta' && activeDocument && (
                <div className="space-y-6">
                  {/* AI Revision form */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Apply AI Revision
                    </h4>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-2">
                        Revision Provider
                      </label>
                      <select
                        value={provider}
                        onChange={(e) =>
                          setProvider(e.target.value as 'OPENAI' | 'CLAUDE' | 'GEMINI')
                        }
                        className="w-full h-10 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none"
                      >
                        <option value="OPENAI">OpenAI GPT-4o</option>
                        <option value="CLAUDE">Claude 3.5 Sonnet</option>
                        <option value="GEMINI">Google Gemini Pro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-2">
                        Instructions
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-900 rounded-lg text-xs p-3 text-slate-200 focus:outline-none resize-none"
                        placeholder="e.g. Focus more on my research..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleRegenerate}
                      disabled={!feedback.trim()}
                      className="w-full h-10 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Version History */}
              {activeTab === 'history' && activeDocument && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Versions History
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowCompare(true)}
                      className="text-[10px] text-brand-400 hover:text-brand-300 font-bold underline"
                    >
                      Open Comparison Workspace
                    </button>
                  </div>

                  {versions.length === 0 && !loadingHistory && (
                    <div className="py-6 text-center text-xs text-slate-600 italic">
                      No history versions found.
                    </div>
                  )}

                  <div className="space-y-2">
                    {versions.map((v) => (
                      <div
                        key={v.id}
                        className={[
                          'p-3 border rounded-xl flex items-center justify-between text-xs transition-all',
                          v.id === activeDocument.id
                            ? 'bg-slate-900/60 border-brand-500/30'
                            : 'bg-slate-950/20 border-slate-900 hover:border-slate-800',
                        ].join(' ')}
                      >
                        <div>
                          <span className="font-bold text-slate-200 block">
                            Version {v.version}
                          </span>
                          <span className="text-slate-500 text-[10px] mt-0.5 block">
                            {v.generatedBy === 'AI' ? `AI Draft (${v.provider})` : 'User Edited'}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {v.id !== activeDocument.id && (
                            <button
                              onClick={() => handleRestoreVersion(v.id)}
                              type="button"
                              className="text-brand-400 hover:text-brand-300 font-semibold"
                            >
                              Restore
                            </button>
                          )}
                          <span className="text-slate-700">|</span>
                          <span className="text-slate-500 font-medium">
                            {new Date(v.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {hasMoreHistory && (
                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => loadHistoryPage(historyPage + 1)}
                        disabled={loadingHistory}
                        className="text-[10px] text-brand-400 hover:text-brand-300 font-bold underline disabled:opacity-50"
                      >
                        {loadingHistory ? 'Loading...' : 'Load more versions'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Activity Timeline */}
              {activeTab === 'timeline' && activeDocument && (
                <ActivityTimeline documentId={activeDocument.id} />
              )}

              {/* TAB 4: Cost Analysis */}
              {activeTab === 'ai' && activeDocument && (
                <AIAnalyticsPanel documentId={activeDocument.id} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Workspace Dialog Overlay */}
      {showCompare && activeDocument && (
        <CompareDialog
          documentId={activeDocument.id}
          activeText={activeDocument.content?.text || ''}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
};

export default SOPGeneratorPage;
