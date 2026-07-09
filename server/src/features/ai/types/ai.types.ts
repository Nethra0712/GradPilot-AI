import { AIContext } from '../context/context.types';

export type AIProviderName = 'OPENAI' | 'CLAUDE' | 'GEMINI';

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface PromptTemplateMetadata {
  id: string;
  version: string;
  createdAt: string;
  description: string;
}

export interface PromptTemplate {
  systemPrompt: string;
  userPrompt: string;
  variables: string[]; // List of variable names expected in the template
  metadata: PromptTemplateMetadata;
}

export interface AIRequest {
  provider?: AIProviderName;
  modelOverride?: string;
  template: PromptTemplate;
  variables: Record<string, unknown>;
  context?: AIContext;
}

export interface ProviderResponse {
  text: string;
  model: string;
  usage: TokenUsage;
  finishReason: string;
}

export interface AIResponse {
  requestId: string;
  text: string;
  provider: AIProviderName;
  model: string;
  usage: TokenUsage;
  finishReason: string;
  latencyMs: number;
  estimatedCost: number;
}

// ─── For Streaming ──────────────────────────────────────────────────────────

export interface AIStreamChunk {
  requestId: string;
  textChunk: string;
  finishReason?: string | null;
  usage?: TokenUsage;
}
