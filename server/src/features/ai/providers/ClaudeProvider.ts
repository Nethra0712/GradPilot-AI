import { AIRequest, ProviderResponse } from '../types/ai.types';
import { AIProvider } from './AIProvider';

/**
 * ClaudeProvider
 * Mock provider simulating Anthropic Claude models responses.
 */
export class ClaudeProvider extends AIProvider {
  public readonly name = 'CLAUDE';

  public async generateText(request: AIRequest, _requestId: string): Promise<ProviderResponse> {
    const model = request.modelOverride || 'claude-3-5-sonnet-20241022';

    // Simulate minor network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const promptText = (request.template.systemPrompt + request.template.userPrompt).substring(
      0,
      300
    );
    const mockText = `[Mock Claude Response]\n\nHello, here is a highly polished statement of purpose crafted by Claude "${model}" matching your achievements. User variables: ${JSON.stringify(request.variables)}`;

    const promptTokens = Math.round(promptText.length / 4) + 15;
    const completionTokens = Math.round(mockText.length / 4) + 15;

    return {
      text: mockText,
      model,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      finishReason: 'end_turn',
    };
  }
}
export default ClaudeProvider;
