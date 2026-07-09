import { AIProvider } from '../providers/AIProvider';

/**
 * ProviderRegistry
 *
 * Coordinates dynamic registration, removal, and lookup of AI providers.
 * Eliminates switch-statement hardcoding, allowing third-party adapters
 * (DeepSeek, Grok, local models) to register without rewriting factory patterns.
 */
export class ProviderRegistry {
  private providers = new Map<string, AIProvider>();

  /**
   * Registers a provider instance.
   */
  public registerProvider(provider: AIProvider): void {
    const key = provider.name.toUpperCase();
    this.providers.set(key, provider);
  }

  /**
   * Removes a registered provider.
   */
  public unregisterProvider(name: string): void {
    const key = name.toUpperCase();
    this.providers.delete(key);
  }

  /**
   * Resolves a provider instance by name.
   * Throws Error if not registered.
   */
  public resolve(name: string): AIProvider {
    const key = name.toUpperCase();
    const provider = this.providers.get(key);
    if (!provider) {
      throw new Error(`AI Provider "${name}" is not registered in the ProviderRegistry.`);
    }
    return provider;
  }

  /**
   * Lists all registered provider names.
   */
  public listProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const providerRegistry = new ProviderRegistry();
export default providerRegistry;
