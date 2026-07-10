import React, { useState, useEffect, useRef } from 'react';
import { Document } from '@/features/documents/types/document.types';

interface DocumentEditorProps {
  document: Document;
  onSave: (text: string) => Promise<unknown>;
  isReadOnly?: boolean;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onSave,
  isReadOnly = false,
}) => {
  const initialText = document.content?.text || '';

  const [text, setText] = useState(initialText);
  const [savedText, setSavedText] = useState(initialText);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Re-initialize when document source changes
  useEffect(() => {
    const docText = document.content?.text || '';
    setText(docText);
    setSavedText(docText);
    setSaveStatus('idle');
  }, [document.id, document.content?.text]);

  // Dirty state navigation blockers
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (text !== savedText) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [text, savedText]);

  const triggerSave = async (textToSave: string) => {
    setSaveStatus('saving');

    // Optimistic Save Indicator
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLastSaved(nowTime);

    try {
      await onSave(textToSave);
      setSavedText(textToSave);
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('failed');
      // Rollback last saved indicator if it failed the first time
      setLastSaved(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    if (isReadOnly) return;

    // Clear existing debounce timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Debounce save for 2 seconds
    saveTimerRef.current = setTimeout(() => {
      triggerSave(val);
    }, 2000);
  };

  const handleRetry = () => {
    triggerSave(text);
  };

  // Metric Computations
  const cleanWords = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = cleanWords.length;
  const charCount = text.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // ~200 WPM

  return (
    <div className="border border-slate-900 bg-slate-950 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden font-sans">
      {/* Editor Toolbar */}
      <div className="px-5 py-3.5 border-b border-slate-900 bg-slate-900/40 flex flex-wrap items-center justify-between gap-4 select-none">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {saveStatus === 'saving' && (
            <div className="flex items-center gap-1.5 text-xs text-brand-400 font-semibold animate-pulse">
              <svg
                className="animate-spin h-3.5 w-3.5 text-brand-400"
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
              <span>Saving changes...</span>
            </div>
          )}

          {saveStatus === 'saved' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>Saved optimistically {lastSaved ? `at ${lastSaved}` : ''}</span>
            </div>
          )}

          {saveStatus === 'failed' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-red-400 font-semibold">Save failed</span>
              <button
                type="button"
                onClick={handleRetry}
                className="text-brand-400 hover:text-brand-300 font-bold underline"
              >
                Retry
              </button>
            </div>
          )}

          {saveStatus === 'idle' && (
            <span className="text-xs text-slate-500 font-medium">Ready to edit</span>
          )}
        </div>

        {/* Toolbar Metrics */}
        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <span>{wordCount} words</span>
          <span>&middot;</span>
          <span>{charCount} chars</span>
          <span>&middot;</span>
          <span>{readingTime} min read</span>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-5 overflow-y-auto">
        {isReadOnly ? (
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {text || <span className="italic text-slate-600">No content available.</span>}
          </div>
        ) : (
          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Start drafting in markdown..."
            className="w-full h-full bg-transparent text-slate-200 text-sm leading-relaxed focus:outline-none resize-none font-sans placeholder-slate-700"
          />
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;
