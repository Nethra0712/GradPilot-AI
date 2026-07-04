import { AIGeneration } from '@prisma/client';

// ─── Input types for AIGeneration CRUD ────────────────────────────────────────

export interface CreateAIGenerationInput {
  userId: string;
  documentId?: string;
  prompt: string;
  response: string;
  tokensUsed?: number;
  provider?: string;
  modelUsed?: string;
}

// ─── Usage tracking for quota enforcement ─────────────────────────────────────

export interface AIUsageSummary {
  userId: string;
  totalGenerations: number;
  totalTokensUsed: number;
  periodStart: Date;
  periodEnd: Date;
}

export type AIGenerationWithDocument = AIGeneration & {
  document: {
    id: string;
    documentType: string;
  } | null;
};
