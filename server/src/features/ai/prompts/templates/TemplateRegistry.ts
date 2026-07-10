import { DocumentType } from '@prisma/client';
import { PromptTemplate } from '../../types/ai.types';
import { sopTemplateV1 } from './sop/sopTemplateV1';

/**
 * TemplateRegistry
 *
 * Central repository holding templates for multiple document types (SOP, CV, etc.).
 * Supports lookups by DocumentType and optional version tags.
 */
export class TemplateRegistry {
  private templates = new Map<string, Map<string, PromptTemplate>>();

  constructor() {
    // Register standard SOP template version 1.0.0
    this.register(DocumentType.SOP, '1.0.0', sopTemplateV1);
  }

  /**
   * Registers a prompt template for a specific document type and version key.
   */
  public register(type: DocumentType, version: string, template: PromptTemplate): void {
    const typeKey = type.toUpperCase();
    if (!this.templates.has(typeKey)) {
      this.templates.set(typeKey, new Map<string, PromptTemplate>());
    }

    const versionsMap = this.templates.get(typeKey);
    if (versionsMap) {
      versionsMap.set(version, template);
    }
  }

  /**
   * Resolves a template based on type and optional version.
   * Defaults to version 1.0.0 if not specified.
   */
  public resolve(type: DocumentType, version = '1.0.0'): PromptTemplate {
    const typeKey = type.toUpperCase();
    const versionsMap = this.templates.get(typeKey);

    if (!versionsMap) {
      throw new Error(`No templates registered for document type: "${type}"`);
    }

    const template = versionsMap.get(version);
    if (!template) {
      throw new Error(`No template found for type "${type}" matching version: "${version}"`);
    }

    return template;
  }

  /**
   * Lists all registered templates keys.
   */
  public listTemplates(): string[] {
    return Array.from(this.templates.keys());
  }
}

export const templateRegistry = new TemplateRegistry();
export default templateRegistry;
