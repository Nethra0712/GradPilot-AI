import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useGenerateSop } from '@/features/documents/hooks/useGenerateSop';
import { useRegenerateSop } from '@/features/documents/hooks/useRegenerateSop';
import { Document } from '@/features/documents/types/document.types';

// Steps for the generation loader
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

  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState<'OPENAI' | 'CLAUDE' | 'GEMINI'>('OPENAI');
  const [feedback, setFeedback] = useState('');
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);

  const [stepIndex, setStepIndex] = useState(-1);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  // Check profile validation parameters locally
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
      const val = (profileData.profile as unknown as Record<string, unknown>)[f.key];
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
    setSaveSuccess(false);

    // 1. Run local validation checks
    const missing = checkProfileFields();
    if (missing.length > 0) {
      return;
    }

    // 2. Play stepper animation
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
        setSaveSuccess(true);
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
    setSaveSuccess(false);

    setStepIndex(2); // directly show running engine pipeline

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
        setSaveSuccess(true);
      }, 600);
    } catch (err) {
      setStepIndex(-1);
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(error.response?.data?.message || error.message || 'Regeneration failed.');
    }
  };

  const copyToClipboard = () => {
    if (activeDocument?.content?.text) {
      navigator.clipboard.writeText(activeDocument.content.text);
      alert('SOP text copied to clipboard!');
    }
  };

  // Helper parser converting raw markdown strings to simple HTML representation
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

  const isGenerating = stepIndex !== -1;
  const missingLocalFields = checkProfileFields();

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* HEADER */}
      <div className="border-b border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Statement of Purpose Generator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Build bespoke Statement of Purpose outlines structured for your university applications.
          </p>
        </div>
        <Link
          to="/documents"
          className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-all w-fit"
        >
          Back to Documents
        </Link>
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

      {/* MAIN CONTAINER */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* LEFT COLUMN: Controls (2/5 size) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 border border-slate-900 bg-slate-900/40 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-display mb-3">
              Generation Controls
            </h3>

            {/* Input: Document Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isGenerating || !!activeDocument}
                className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                placeholder="e.g. Stanford MSCS SOP"
              />
            </div>

            {/* Selector: Provider Choice */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                AI Provider Engine
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as 'OPENAI' | 'CLAUDE' | 'GEMINI')}
                disabled={isGenerating}
                className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
              >
                <option value="OPENAI">OpenAI GPT-4o (Standard)</option>
                <option value="CLAUDE">Claude 3.5 Sonnet (Creative)</option>
                <option value="GEMINI">Google Gemini Pro (Analytical)</option>
              </select>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="p-3.5 border border-red-500/20 bg-red-500/5 rounded-xl text-xs text-red-400 leading-normal">
                {errorMsg}
              </div>
            )}

            {/* Save success alerts */}
            {saveSuccess && (
              <div className="p-3.5 border border-emerald-500/20 bg-emerald-500/5 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                <span>Document saved successfully! Version {activeDocument?.version} loaded.</span>
              </div>
            )}

            {/* Action Trigger Buttons */}
            {!activeDocument ? (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || missingLocalFields.length > 0}
                className="w-full h-11 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(56,85,255,0.3)]"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                    <span>Generating Draft...</span>
                  </>
                ) : (
                  <span>Compile & Generate SOP</span>
                )}
              </button>
            ) : (
              <div className="border-t border-slate-900/60 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Regenerate with feedback
                </h4>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={isGenerating}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl text-sm p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none disabled:opacity-50"
                  placeholder="e.g. Focus more on my project research or make the tone more academic..."
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={isGenerating || !feedback.trim()}
                    className="flex-1 h-11 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Apply Revision
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDocument(null);
                      setSaveSuccess(false);
                    }}
                    disabled={isGenerating}
                    className="px-4 h-11 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Output display / Editor viewer (3/5 size) */}
        <div className="lg:col-span-3">
          {/* STEPPER LOADER IF GENERATING */}
          {isGenerating && (
            <div className="p-8 border border-slate-900 bg-slate-900/20 rounded-2xl flex flex-col justify-center items-center py-20 space-y-8 select-none">
              <svg
                className="animate-spin h-10 w-10 text-brand-500"
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

              {/* Steps stepper checklist */}
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
                          isFinished
                            ? 'text-slate-400'
                            : isActive
                              ? 'text-white'
                              : 'text-slate-600',
                        ].join(' ')}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!activeDocument && !isGenerating && (
            <div className="p-8 border border-slate-900 bg-slate-900/20 rounded-2xl flex flex-col justify-center items-center py-32 text-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-300">No Document Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-normal">
                Populate options in the control panel and trigger the compiler pipeline to view your
                Statements.
              </p>
            </div>
          )}

          {/* DOCUMENT PREVIEW */}
          {activeDocument && !isGenerating && (
            <div className="border border-slate-900 bg-slate-950 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
              {/* Editor Header stats */}
              <div className="px-5 py-4 border-b border-slate-900 bg-slate-900/40 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 truncate">
                    {activeDocument.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 font-semibold">
                    <span>Version {activeDocument.version}</span>
                    <span>&middot;</span>
                    <span className="uppercase text-brand-400">
                      {activeDocument.provider} ({activeDocument.model})
                    </span>
                    <span>&middot;</span>
                    <span>
                      {activeDocument.content?.text
                        ? activeDocument.content.text.split(/\s+/).filter(Boolean).length
                        : 0}{' '}
                      words
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-3 h-8 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Copy Text
                  </button>
                  {/* Download Placeholder Actions */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        alert(`Mock export file downloaded in ${e.target.value} format!`);
                        e.target.value = '';
                      }
                    }}
                    className="px-2 h-8 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-bold focus:outline-none"
                  >
                    <option value="">Download</option>
                    <option value="PDF">As PDF</option>
                    <option value="DOCX">As Word (DOCX)</option>
                    <option value="TXT">As Text (TXT)</option>
                  </select>
                </div>
              </div>

              {/* Document Text Editor Area */}
              <div className="p-6 flex-1 overflow-y-auto font-sans">
                {activeDocument.content?.text ? (
                  <div className="prose prose-invert max-w-none">
                    {renderTextAsHtml(activeDocument.content.text)}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 italic">No content available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOPGeneratorPage;
