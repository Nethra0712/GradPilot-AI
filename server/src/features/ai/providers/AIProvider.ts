import { AIRequest, ProviderResponse, AIStreamChunk } from '../types/ai.types';

/**
 * AIProvider
 *
 * Abstract base class representing a LLM provider adapter (OpenAI, Claude, Gemini, etc.).
 * Guarantees that the core generation pipelines remain completely decoupled from provider-specific SDKs.
 */
export abstract class AIProvider {
  public abstract readonly name: string;

  /**
   * Generates a standard text completion.
   */
  public abstract generateText(request: AIRequest, requestId: string): Promise<ProviderResponse>;

  /**
   * Prepared signature for streaming text generation (Sprint 8+ compatibility).
   * Throws "Not implemented" by default, allowing incremental provider upgrades.
   */
  public generateStream(_request: AIRequest, _requestId: string): AsyncIterable<AIStreamChunk> {
    throw new Error(`Streaming is not implemented for provider "${this.name}" yet.`);
  }
}
export default AIProvider;
