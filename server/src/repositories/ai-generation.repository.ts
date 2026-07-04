import { AIGeneration } from '@prisma/client';
import { AIUsageSummary, CreateAIGenerationInput } from '@/types/ai-generation.types';

/**
 * AIGenerationRepository
 *
 * Data-access layer for the AIGeneration model.
 * Every call to an AI provider that produces a stored output creates one record here.
 * Records are append-only — no updates or deletes are ever performed.
 * The `createdAt` index makes date-range queries (quota enforcement) efficient.
 */
export class AIGenerationRepository {
  /**
   * Find a single generation record by ID.
   * Used for displaying past generation details in the document history panel.
   */
  async findById(_id: string): Promise<AIGeneration | null> {
    throw new Error('Not implemented');
  }

  /**
   * List all generation records for a user, ordered by creation date descending.
   * Used for the generation history view on the document editor page.
   */
  async findManyByUserId(_userId: string): Promise<AIGeneration[]> {
    throw new Error('Not implemented');
  }

  /**
   * List all generation records tied to a specific document.
   * Used to display the version history panel on the document editor.
   */
  async findManyByDocumentId(_documentId: string): Promise<AIGeneration[]> {
    throw new Error('Not implemented');
  }

  /**
   * Create a new generation record after a successful AI API response.
   * This is the only mutation operation — records are never updated after creation.
   */
  async create(_data: CreateAIGenerationInput): Promise<AIGeneration> {
    throw new Error('Not implemented');
  }

  /**
   * Aggregate token usage and generation count for a user within a date range.
   * Used for quota enforcement — e.g. checking if a Free tier user has remaining generations.
   */
  async getUsageSummary(
    _userId: string,
    _periodStart: Date,
    _periodEnd: Date
  ): Promise<AIUsageSummary> {
    throw new Error('Not implemented');
  }
}

export const aiGenerationRepository = new AIGenerationRepository();
