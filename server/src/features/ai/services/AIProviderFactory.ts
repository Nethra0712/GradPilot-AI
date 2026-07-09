import { OpenAIProvider } from '../providers/OpenAIProvider';
import { ClaudeProvider } from '../providers/ClaudeProvider';
import { GeminiProvider } from '../providers/GeminiProvider';
import { providerRegistry } from './ProviderRegistry';
import { AIProvider } from '../providers/AIProvider';
import { aiConfig } from '../config/ai.config';

/**
 * AIProviderFactory
 *
 * Bootstraps standard provider registrations on application start
 * and resolves instances using the centralized ProviderRegistry.
 */
export class AIProviderFactory {
  constructor() {
    // Bootstrap standard provider instances in the registry
    providerRegistry.registerProvider(new OpenAIProvider());
    providerRegistry.registerProvider(new ClaudeProvider());
    providerRegistry.registerProvider(new GeminiProvider());
  }

  /**
   * Resolves the configured active provider instance.
   * If an explicit providerName is passed, overrides config values.
   */
  public getProvider(providerName?: string): AIProvider {
    const target = providerName || aiConfig.getActiveProvider();
    return providerRegistry.resolve(target);
  }
}

export const aiProviderFactory = new AIProviderFactory();
export default aiProviderFactory;
