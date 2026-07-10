import prisma from '@/prisma/client';
import { Document, DocumentType, DocumentStatus, Prisma, Profile } from '@prisma/client';
import { documentRepository } from '../repositories/document.repository';
import { aiEngine } from '../features/ai/services/AIEngine';
import { templateRegistry } from '../features/ai/prompts/templates/TemplateRegistry';
import { ApiError } from '../utils/apiError';
import { AIProviderName } from '../features/ai/types/ai.types';

/**
 * DocumentService
 *
 * Orchestrates generic, type-independent document generation lifecycles.
 * Supports Statement of Purpose (SOP) compilation, regeneration,
 * and version history tracking.
 */
export class DocumentService {
  /**
   * Validates if a student profile possesses all required fields for generation.
   */
  public async validateProfile(userId: string): Promise<{
    isValid: boolean;
    missingFields: string[];
  }> {
    const profile = await prisma.profile.findFirst({
      where: { userId, deletedAt: null },
    });

    const requiredFields: Array<{ key: keyof Profile; label: string }> = [
      { key: 'nationality', label: 'Nationality' },
      { key: 'currentEducation', label: 'Current Education Level' },
      { key: 'institution', label: 'Current Institution' },
      { key: 'targetDegree', label: 'Target Degree' },
      { key: 'targetUniversities', label: 'Target Universities' },
    ];

    const missingFields: string[] = [];

    if (!profile) {
      return {
        isValid: false,
        missingFields: requiredFields.map((f) => f.label),
      };
    }

    requiredFields.forEach((field) => {
      const val = profile[field.key];
      if (val === null || val === undefined || val === '') {
        missingFields.push(field.label);
      } else if (Array.isArray(val) && val.length === 0) {
        missingFields.push(field.label);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Executes the generic document generation pipeline.
   */
  public async generateDocument(
    userId: string,
    type: DocumentType,
    options: {
      provider?: AIProviderName;
      modelOverride?: string;
      title?: string;
      customVariables?: Record<string, unknown>;
    }
  ): Promise<Document> {
    // 1. Validate profile parameters
    const check = await this.validateProfile(userId);
    if (!check.isValid) {
      throw new ApiError(400, 'Student profile is incomplete.', {
        missingFields: check.missingFields,
      });
    }

    const defaultTitle = type === DocumentType.SOP ? 'Statement of Purpose' : 'Untitled Document';
    const title = options.title || defaultTitle;

    // 2. Create database wrapper in PENDING state
    const doc = await documentRepository.create({
      userId,
      title,
      documentType: type,
      status: DocumentStatus.PENDING,
      version: 1,
    });

    try {
      // 3. Mark state as GENERATING
      await documentRepository.update(doc.id, {
        status: DocumentStatus.GENERATING,
      });

      // 4. Resolve templates dynamically from the Template Registry
      const template = templateRegistry.resolve(type, '1.0.0');

      // 5. Execute core AI Engine completion
      const response = await aiEngine.generate(userId, {
        provider: options.provider,
        modelOverride: options.modelOverride,
        template,
        variables: {
          additionalInstructions: '',
          ...(options.customVariables || {}),
        },
      });

      // 6. Complete state changes and log response metadata
      const updatedDoc = await documentRepository.update(doc.id, {
        status: DocumentStatus.COMPLETED,
        content: { text: response.text } as Prisma.InputJsonValue,
        promptVersion: '1.0.0',
        provider: response.provider,
        model: response.model,
        requestId: response.requestId,
      });

      return updatedDoc;
    } catch (err) {
      // Update state to FAILED on operational issues
      await documentRepository.update(doc.id, {
        status: DocumentStatus.FAILED,
      });
      throw err;
    }
  }

  /**
   * Regenerates a document by creating a new version pointing back to the parent root.
   */
  public async regenerateDocument(
    userId: string,
    documentId: string,
    options: {
      feedbackInstructions?: string;
      provider?: AIProviderName;
      modelOverride?: string;
    }
  ): Promise<Document> {
    // 1. Resolve parent document metadata
    const doc = await documentRepository.findById(documentId);
    if (!doc) {
      throw new ApiError(404, 'Document not found.');
    }

    if (doc.userId !== userId) {
      throw new ApiError(403, 'You do not own this document.');
    }

    // 2. Validate profile parameters
    const check = await this.validateProfile(userId);
    if (!check.isValid) {
      throw new ApiError(400, 'Student profile is incomplete.', {
        missingFields: check.missingFields,
      });
    }

    // Resolve the parent root document ID
    const parentId = doc.parentId || doc.id;

    // Load active child records to find the latest version number
    let latestVersionNum = doc.version;
    if (doc.children && doc.children.length > 0) {
      const maxChildVersion = Math.max(...doc.children.map((c) => c.version));
      latestVersionNum = Math.max(latestVersionNum, maxChildVersion);
    }

    // 3. Create database wrapper for the new version in PENDING state
    const newDoc = await documentRepository.create({
      userId,
      title: doc.title,
      documentType: doc.documentType,
      status: DocumentStatus.PENDING,
      version: latestVersionNum + 1,
      parentId,
    });

    try {
      // Mark as GENERATING
      await documentRepository.update(newDoc.id, {
        status: DocumentStatus.GENERATING,
      });

      // 4. Resolve template registry details
      const template = templateRegistry.resolve(doc.documentType, '1.0.0');

      // Add feedback text constraints to compilation inputs
      const feedback = options.feedbackInstructions
        ? `\n\nRevision request: ${options.feedbackInstructions}`
        : '';

      // 5. Invoke core AI Engine with instructions appended
      const response = await aiEngine.generate(userId, {
        provider: options.provider,
        modelOverride: options.modelOverride,
        template,
        variables: {
          additionalInstructions: feedback,
        },
      });

      // 6. Complete state changes and log response metadata
      const updatedDoc = await documentRepository.update(newDoc.id, {
        status: DocumentStatus.COMPLETED,
        content: { text: response.text } as Prisma.InputJsonValue,
        promptVersion: '1.0.0',
        provider: response.provider,
        model: response.model,
        requestId: response.requestId,
      });

      return updatedDoc;
    } catch (err) {
      await documentRepository.update(newDoc.id, {
        status: DocumentStatus.FAILED,
      });
      throw err;
    }
  }

  /**
   * Retrieves a single document by its ID.
   */
  public async getDocument(userId: string, id: string): Promise<Document> {
    const doc = await documentRepository.findById(id);
    if (!doc) {
      throw new ApiError(404, 'Document not found.');
    }
    if (doc.userId !== userId) {
      throw new ApiError(403, 'You do not own this document.');
    }
    return doc;
  }

  /**
   * Lists all primary documents belonging to the user.
   */
  public async listDocuments(userId: string): Promise<Document[]> {
    return documentRepository.findByUserId(userId);
  }

  /**
   * Soft-deletes a document.
   */
  public async deleteDocument(userId: string, id: string): Promise<Document> {
    const doc = await documentRepository.findById(id);
    if (!doc) {
      throw new ApiError(404, 'Document not found.');
    }
    if (doc.userId !== userId) {
      throw new ApiError(403, 'You do not own this document.');
    }
    return documentRepository.softDelete(id);
  }
}

export const documentService = new DocumentService();
export default documentService;
