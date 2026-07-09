import { PromptTemplate } from '../types/ai.types';
import { PromptValidationError } from '../utils/ai.errors';

/**
 * PromptRenderer
 *
 * Injects resolved variable values into double curly bracket placeholders (e.g. {{variable}}).
 * Validates that all required placeholders specified in template definitions exist.
 */
export class PromptRenderer {
  /**
   * Renders the final prompt string from the template and resolved variables.
   * Throws PromptValidationError if expected variables are missing.
   */
  public render(
    template: PromptTemplate,
    variables: Record<string, string>,
    requestId: string
  ): { systemPrompt: string; userPrompt: string } {
    // 1. Validate required template variables exist
    const missing: string[] = [];
    template.variables.forEach((reqVar) => {
      if (variables[reqVar] === undefined) {
        missing.push(reqVar);
      }
    });

    if (missing.length > 0) {
      throw new PromptValidationError(
        `Failed to compile prompt template. Missing required variables: ${missing.join(', ')}`,
        requestId
      );
    }

    // 2. Perform double curly bracket interpolation
    const systemPrompt = this.interpolate(template.systemPrompt, variables);
    const userPrompt = this.interpolate(template.userPrompt, variables);

    return { systemPrompt, userPrompt };
  }

  /**
   * Interpolates {{key}} placeholders within a string using matching record values.
   */
  private interpolate(content: string, variables: Record<string, string>): string {
    return content.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
      if (variables[key] !== undefined) {
        return variables[key];
      }
      return match; // return original placeholder if key matches nothing
    });
  }
}
