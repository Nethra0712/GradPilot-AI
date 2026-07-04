import { AIUsageSummary, CreateAIGenerationInput } from '@/types/ai-generation.types';
import { AIGeneration } from '@prisma/client';

/**
 * AIGenerationService
 *
 * Business logic layer for the AIGeneration domain.
 * Records are append-only — once a generation is saved, it is never modified.
 * This service will also be responsible for quota enforcement in Sprint 5:
 * before allowing a new generation, it will check whether the user has
 * remaining quota for the current billing period.
 */
export class AIGenerationService {
  /**
   * Retrieve a specific generation record by ID.
   * Used to display a past generation in the document version history panel.
   */
  async getGenerationById(_id: string): Promise<AIGeneration | null> {
    throw new Error('Not implemented');
  }

  /**
   * List all generations for a document.
   * Used to render the version history sidebar on the document editor.
   */
  async listDocumentGenerations(_documentId: string): Promise<AIGeneration[]> {
    throw new Error('Not implemented');
  }

  /**
   * Save a generation record after a successful AI API response.
   * Called by the AI generation pipeline after the provider returns a result.
   */
  async recordGeneration(_data: CreateAIGenerationInput): Promise<AIGeneration> {
    throw new Error('Not implemented');
  }

  /**
   * Get token usage and generation count for the current billing period.
   * Used to display quota usage in the user dashboard and enforce plan limits.
   */
  async getMonthlyUsage(_userId: string): Promise<AIUsageSummary> {
    throw new Error('Not implemented');
  }
}

export const aiGenerationService = new AIGenerationService();
