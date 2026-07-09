import { PromptTemplate } from '../types/ai.types';
import { AIContext } from '../context/context.types';
import { PromptVariableResolver } from './PromptVariableResolver';
import { PromptRenderer } from './PromptRenderer';

/**
 * PromptBuilder
 *
 * Coordinates variable resolution and interpolation to generate
 * final prompt instructions for consumption by LLM providers.
 */
export class PromptBuilder {
  private variableResolver = new PromptVariableResolver();
  private renderer = new PromptRenderer();

  /**
   * Builds the final system and user prompts using student context and template maps.
   */
  public build(
    template: PromptTemplate,
    context: AIContext | undefined,
    customVars: Record<string, unknown>,
    requestId: string
  ): { systemPrompt: string; userPrompt: string } {
    // 1. Resolve variables
    const resolvedVars = this.variableResolver.resolve(context, customVars);

    // 2. Render templates
    return this.renderer.render(template, resolvedVars, requestId);
  }
}

export const promptBuilder = new PromptBuilder();
export default promptBuilder;
