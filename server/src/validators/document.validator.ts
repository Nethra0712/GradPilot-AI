import { z } from 'zod';

const providerEnum = z.enum(['OPENAI', 'CLAUDE', 'GEMINI']).optional();

export const generateSopSchema = z.object({
  provider: providerEnum,
  modelOverride: z.string().optional(),
  title: z.string().optional(),
  customVariables: z.record(z.unknown()).optional(),
});

export const regenerateSopSchema = z.object({
  documentId: z.string().uuid('Invalid document UUID'),
  feedbackInstructions: z.string().min(1, 'Feedback revision request cannot be empty'),
  provider: providerEnum,
  modelOverride: z.string().optional(),
});
