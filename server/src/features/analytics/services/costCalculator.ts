/**
 * CostCalculator
 *
 * Exposes pricing utilities to aggregate OpenAI, Anthropic, and Gemini usage rates.
 */
export const getProviderCost = (
  provider: string,
  model: string,
  promptTokens: number,
  completionTokens: number
): number => {
  const providerKey = provider.toLowerCase();
  const modelKey = model.toLowerCase();

  // Pricing per 1,000,000 tokens in USD
  let promptRate = 0.0;
  let completionRate = 0.0;

  if (providerKey.includes('openai')) {
    if (modelKey.includes('gpt-4o-mini')) {
      promptRate = 0.15;
      completionRate = 0.6;
    } else {
      // Standard GPT-4o pricing defaults
      promptRate = 2.5;
      completionRate = 10.0;
    }
  } else if (providerKey.includes('claude') || providerKey.includes('anthropic')) {
    if (modelKey.includes('haiku')) {
      promptRate = 0.25;
      completionRate = 1.25;
    } else {
      // Claude 3.5 Sonnet defaults
      promptRate = 3.0;
      completionRate = 15.0;
    }
  } else if (providerKey.includes('gemini') || providerKey.includes('google')) {
    if (modelKey.includes('flash')) {
      promptRate = 0.075;
      completionRate = 0.3;
    } else {
      // Gemini 1.5 Pro defaults
      promptRate = 1.25;
      completionRate = 5.0;
    }
  } else {
    // General default fallback rates
    promptRate = 1.5;
    completionRate = 6.0;
  }

  const promptCost = (promptTokens / 1000000) * promptRate;
  const completionCost = (completionTokens / 1000000) * completionRate;

  return Number((promptCost + completionCost).toFixed(6));
};
