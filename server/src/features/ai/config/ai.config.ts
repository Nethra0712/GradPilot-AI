import { env } from '@/config/env';
import { AIProviderName } from '../types/ai.types';

/**
 * AIConfig
 *
 * Central configuration module for all AI engines and features.
 * Decouples process.env lookups from core generation logic.
 */
export class AIConfig {
  /**
   * Returns the active provider name specified in configuration environment files.
   */
  getActiveProvider(): AIProviderName {
    const provider = env.AI_PROVIDER || 'openai';
    const upper = provider.toUpperCase();

    if (upper === 'CLAUDE' || upper === 'ANTHROPIC') {
      return 'CLAUDE';
    }
    if (upper === 'GEMINI' || upper === 'GOOGLE') {
      return 'GEMINI';
    }
    return 'OPENAI'; // Default fallback
  }

  /**
   * Returns the default model name for the selected provider.
   */
  getDefaultModel(provider: AIProviderName): string {
    switch (provider) {
      case 'CLAUDE':
        return 'claude-3-5-sonnet-20241022';
      case 'GEMINI':
        return 'gemini-1.5-pro';
      case 'OPENAI':
      default:
        return 'gpt-4o';
    }
  }

  /**
   * Returns max token safety limits for requests.
   */
  getMaxTokenLimit(): number {
    return 4000;
  }

  /**
   * Returns cost per 1K tokens for estimate outputs (e.g. gpt-4o price average).
   */
  getCostPerThousandTokens(provider: AIProviderName, isPrompt: boolean): number {
    switch (provider) {
      case 'CLAUDE':
        return isPrompt ? 0.003 : 0.015;
      case 'GEMINI':
        return isPrompt ? 0.00125 : 0.00375;
      case 'OPENAI':
      default:
        return isPrompt ? 0.005 : 0.015;
    }
  }

  /**
   * Checks whether mock mode is enabled.
   * During this foundation sprint, we default mockMode to true.
   */
  isMockModeEnabled(): boolean {
    return true;
  }
}

export const aiConfig = new AIConfig();
export default aiConfig;
