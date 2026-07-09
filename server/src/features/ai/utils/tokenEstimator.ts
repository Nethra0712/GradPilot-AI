import { TokenUsage } from '../types/ai.types';

/**
 * Utility to estimate token usage budgets.
 *
 * Strategy:
 * Standard English text contains roughly 4 characters per token (or ~0.75 words per token).
 * For this sprint, we approximate token usage based on character length checks.
 * This ensures compliance and provides metadata for pricing estimations before calling active endpoints.
 */
export function estimateTokens(promptText: string, expectedCompletionText?: string): TokenUsage {
  const cleanPrompt = promptText || '';
  const promptTokens = Math.max(1, Math.round(cleanPrompt.length / 4));

  // If no mock response is available yet, default to a standard 400 token estimation
  const cleanCompletion = expectedCompletionText || 'a'.repeat(1600);
  const completionTokens = Math.max(1, Math.round(cleanCompletion.length / 4));

  return {
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
  };
}
export default estimateTokens;
