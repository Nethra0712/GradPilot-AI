import { ApiError } from '@/utils/apiError';

export class AIError extends ApiError {
  public readonly code: string;
  public readonly requestId: string;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    requestId: string,
    details?: unknown
  ) {
    super(statusCode, message, details);
    this.code = code;
    this.requestId = requestId;
  }
}

export class ProviderUnavailableError extends AIError {
  constructor(providerName: string, requestId: string, details?: unknown) {
    super(
      503,
      'PROVIDER_UNAVAILABLE',
      `The AI provider "${providerName}" is currently unavailable or returned an error.`,
      requestId,
      details
    );
  }
}

export class PromptValidationError extends AIError {
  constructor(message: string, requestId: string, details?: unknown) {
    super(400, 'PROMPT_VALIDATION_ERROR', message, requestId, details);
  }
}

export class TokenLimitError extends AIError {
  constructor(estimatedTokens: number, maxLimit: number, requestId: string) {
    super(
      400,
      'TOKEN_LIMIT_EXCEEDED',
      `Estimated tokens (${estimatedTokens}) exceed the set safety limit of ${maxLimit} tokens.`,
      requestId
    );
  }
}

export class ConfigurationError extends AIError {
  constructor(message: string, requestId: string) {
    super(500, 'CONFIGURATION_ERROR', message, requestId);
  }
}
