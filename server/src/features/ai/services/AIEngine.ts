import crypto from 'crypto';
import prisma from '@/prisma/client';
import { AIRequest, AIResponse, AIProviderName } from '../types/ai.types';
import { aiConfig } from '../config/ai.config';
import { aiProviderFactory } from './AIProviderFactory';
import { promptBuilder } from '../prompts/PromptBuilder';
import { estimateTokens } from '../utils/tokenEstimator';
import { TokenLimitError, ConfigurationError } from '../utils/ai.errors';
import { buildAIContext } from '../context/contextBuilder';

/**
 * AIEngine
 *
 * Coordinates the full LLM generation lifecycle pipeline:
 * 1. Initialize Unique Request ID (for logging/correlation).
 * 2. Load Student Context & format prompt variables.
 * 3. Render templates & estimate token budgets.
 * 4. Resolve provider and delegate calls.
 * 5. Audit log usage statistics in database.
 * 6. Format standardized results.
 */
export class AIEngine {
  /**
   * Orchestrates the standard text completion pipeline.
   */
  public async generate(userId: string, request: AIRequest): Promise<AIResponse> {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      // 1. Fetch User & Profile to compile AI Context
      const profile = await prisma.profile.findFirst({
        where: { userId, deletedAt: null },
      });
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!profile) {
        throw new ConfigurationError(
          'Student profile is missing. Please complete your academic profile before running AI generations.',
          requestId
        );
      }

      const aiContext = buildAIContext(profile, user || undefined);

      // 2. Resolve variables and render system/user prompts
      const renderedPrompt = promptBuilder.build(
        request.template,
        aiContext,
        request.variables,
        requestId
      );

      const combinedPromptText = `${renderedPrompt.systemPrompt}\n${renderedPrompt.userPrompt}`;

      // 3. Estimate tokens and validate safety limits
      const promptEstimate = estimateTokens(combinedPromptText);
      const maxLimit = aiConfig.getMaxTokenLimit();
      if (promptEstimate.promptTokens > maxLimit) {
        throw new TokenLimitError(promptEstimate.promptTokens, maxLimit, requestId);
      }

      // 4. Resolve the configured active provider instance
      const provider = aiProviderFactory.getProvider(request.provider);

      // 5. Invoke mock Provider
      const providerResponse = await provider.generateText(
        {
          ...request,
          context: aiContext,
        },
        requestId
      );

      const latencyMs = Date.now() - startTime;

      // 6. Calculate total token counts and pricing costs
      const promptCostRate = aiConfig.getCostPerThousandTokens(
        provider.name as AIProviderName,
        true
      );
      const completionCostRate = aiConfig.getCostPerThousandTokens(
        provider.name as AIProviderName,
        false
      );

      const promptCost = (providerResponse.usage.promptTokens / 1000) * promptCostRate;
      const completionCost = (providerResponse.usage.completionTokens / 1000) * completionCostRate;
      const estimatedCost = parseFloat((promptCost + completionCost).toFixed(6));

      // 7. Write audit log into the AIGeneration table in database
      await prisma.aIGeneration.create({
        data: {
          userId,
          prompt: combinedPromptText,
          response: providerResponse.text,
          tokensUsed: providerResponse.usage.totalTokens,
          provider: provider.name.toLowerCase(),
          modelUsed: providerResponse.model,
          requestId,
          promptTokens: providerResponse.usage.promptTokens,
          completionTokens: providerResponse.usage.completionTokens,
          latency: latencyMs,
        },
      });

      // 8. Return standardized response structure
      return {
        requestId,
        text: providerResponse.text,
        provider: provider.name as AIProviderName,
        model: providerResponse.model,
        usage: providerResponse.usage,
        finishReason: providerResponse.finishReason,
        latencyMs,
        estimatedCost,
      };
    } catch (error) {
      // Ensure any generated exceptions map requests correlation IDs
      const err = error as Record<string, unknown>;
      if (err && err.requestId === undefined) {
        err.requestId = requestId;
      }
      throw error;
    }
  }
}

export const aiEngine = new AIEngine();
export default aiEngine;
