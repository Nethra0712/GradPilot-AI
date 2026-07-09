import { AIRequest, ProviderResponse } from '../types/ai.types';
import { AIProvider } from './AIProvider';

/**
 * GeminiProvider
 * Mock provider simulating Google Gemini models responses.
 */
export class GeminiProvider extends AIProvider {
  public readonly name = 'GEMINI';

  public async generateText(request: AIRequest, _requestId: string): Promise<ProviderResponse> {
    const model = request.modelOverride || 'gemini-1.5-pro';

    // Simulate minor network delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const promptText = (request.template.systemPrompt + request.template.userPrompt).substring(
      0,
      300
    );
    const mockText = `[Mock Gemini Response]\n\nGreetings from Google Gemini! Synthesized application outline via model "${model}". User variables: ${JSON.stringify(request.variables)}`;

    const promptTokens = Math.round(promptText.length / 4) + 8;
    const completionTokens = Math.round(mockText.length / 4) + 8;

    return {
      text: mockText,
      model,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      finishReason: 'stop',
    };
  }
}
export default GeminiProvider;
