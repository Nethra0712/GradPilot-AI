import React, { useState, useEffect } from 'react';
import { documentService, AIAnalyticsData } from '@/features/documents/services/document.service';

interface AIAnalyticsPanelProps {
  documentId: string;
}

export const AIAnalyticsPanel: React.FC<AIAnalyticsPanelProps> = ({ documentId }) => {
  const [data, setData] = useState<AIAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await documentService.getAnalytics(documentId);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load cost analytics:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [documentId]);

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
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
    );
  }

  if (error || !data) {
    return (
      <div className="py-6 text-center text-xs text-red-400 font-medium">
        Failed to calculate model cost analytics or no AI queries ran on this draft.
      </div>
    );
  }

  const rates = data.summary;

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Active Version Analytics */}
      <div className="p-4 border border-slate-900 bg-slate-950/40 rounded-xl space-y-3">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Active Draft Metadata
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">AI Engine</span>
            <span className="font-semibold text-slate-200 uppercase">{data.provider}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Model Identifier</span>
            <span className="font-semibold text-slate-200 truncate block">{data.model}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Request Latency</span>
            <span className="font-semibold text-slate-200">{data.latency}ms</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Estimated Cost</span>
            <span className="font-semibold text-brand-400">${data.cost.toFixed(6)}</span>
          </div>
        </div>
      </div>

      {/* Aggregate Session Statistics */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Aggregate Version History Stats
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-slate-900 bg-slate-900/10 rounded-xl text-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Total Generations
            </span>
            <span className="text-lg font-bold text-white">{rates.generationsCount} runs</span>
          </div>

          <div className="p-4 border border-slate-900 bg-slate-900/10 rounded-xl text-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Average Latency
            </span>
            <span className="text-lg font-bold text-white">{rates.averageLatency}ms</span>
          </div>

          <div className="p-4 border border-slate-900 bg-slate-900/10 rounded-xl text-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Avg Tokens / run
            </span>
            <span className="text-lg font-bold text-white">{rates.averageTokens} tokens</span>
          </div>

          <div className="p-4 border border-slate-900 bg-slate-900/10 rounded-xl text-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Cumulative USD Cost
            </span>
            <span className="text-lg font-bold text-brand-400">
              ${rates.totalEstimatedCost.toFixed(5)}
            </span>
          </div>
        </div>

        {/* Detailed Token Splits */}
        <div className="p-4 border border-slate-900 bg-slate-950/40 rounded-xl text-xs space-y-2.5">
          <div className="flex justify-between font-medium">
            <span className="text-slate-500">Cumulative Prompt input</span>
            <span className="text-slate-300">{rates.totalPromptTokens} tokens</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-slate-500">Cumulative Completion output</span>
            <span className="text-slate-300">{rates.totalCompletionTokens} tokens</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t border-slate-900 text-xs">
            <span className="text-slate-400">Total consumption</span>
            <span className="text-white">
              {rates.totalPromptTokens + rates.totalCompletionTokens} tokens
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsPanel;
