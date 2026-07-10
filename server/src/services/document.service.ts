import prisma from '@/prisma/client';
import {
  Document,
  DocumentType,
  DocumentStatus,
  Prisma,
  Profile,
  ActivityType,
} from '@prisma/client';
import { documentRepository } from '../repositories/document.repository';
import { aiEngine } from '../features/ai/services/AIEngine';
import { templateRegistry } from '../features/ai/prompts/templates/TemplateRegistry';
import { ApiError } from '../utils/apiError';
import { AIProviderName } from '../features/ai/types/ai.types';
import { getProviderCost } from '../features/analytics/services/costCalculator';

interface AnalyticsResult {
  provider: string;
  model: string;
  promptVersion: string;
  latency: number;
  tokens: number;
  cost: number;
  summary: {
    averageLatency: number;
    generationsCount: number;
    averageTokens: number;
    totalPromptTokens: number;
    totalCompletionTokens: number;
    totalEstimatedCost: number;
  };
}

// Local cache storage with 60-second expiration TTL
interface CacheEntry {
  data: AnalyticsResult;
  expiresAt: number;
}
const analyticsCache = new Map<string, CacheEntry>();

/**
 * DocumentService
 *
 * Orchestrates document generation, edits, tags, history restoration,
 * activity logging, and cached analytics.
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
   * Enforces status validation constraints.
   * Throws 409 Conflict if a generation process is currently running.
   */
  private verifyState(doc: Document): void {
    if (doc.status === DocumentStatus.PENDING || doc.status === DocumentStatus.GENERATING) {
      throw new ApiError(
        409,
        'Conflict: Document is locked while an AI generation is in progress.'
      );
    }
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
      folderId?: string;
    }
  ): Promise<Document> {
    const check = await this.validateProfile(userId);
    if (!check.isValid) {
      throw new ApiError(400, 'Student profile is incomplete.', {
        missingFields: check.missingFields,
      });
    }

    const defaultTitle = type === DocumentType.SOP ? 'Statement of Purpose' : 'Untitled Document';
    const title = options.title || defaultTitle;

    // Create record in PENDING state
    const doc = await documentRepository.create({
      userId,
      title,
      documentType: type,
      status: DocumentStatus.PENDING,
      version: 1,
      folderId: options.folderId,
    });

    // Log creation activity
    await this.logActivity(doc.id, ActivityType.CREATED);

    try {
      // Mark as GENERATING
      await documentRepository.update(doc.id, userId, {
        status: DocumentStatus.GENERATING,
      });

      const template = templateRegistry.resolve(type, '1.0.0');

      const response = await aiEngine.generate(userId, {
        provider: options.provider,
        modelOverride: options.modelOverride,
        template,
        variables: {
          additionalInstructions: '',
          ...(options.customVariables || {}),
        },
      });

      // Complete state changes & save metadata
      const updatedDoc = await documentRepository.update(doc.id, userId, {
        status: DocumentStatus.COMPLETED,
        content: { text: response.text } as Prisma.InputJsonValue,
        promptVersion: '1.0.0',
        provider: response.provider,
        model: response.model,
        requestId: response.requestId,
      });

      // Log generation activity
      await this.logActivity(doc.id, ActivityType.GENERATED);

      return updatedDoc;
    } catch (err) {
      await documentRepository.update(doc.id, userId, {
        status: DocumentStatus.FAILED,
      });
      throw err;
    }
  }

  /**
   * Saves text edits.
   * If document is AI-generated, forks it into a USER-generated version to avoid overwrite.
   */
  public async saveUserEdits(userId: string, id: string, text: string): Promise<Document> {
    const doc = await documentRepository.findById(id, userId);
    if (!doc) {
      throw new ApiError(404, 'Document not found.');
    }
    this.verifyState(doc);

    if (doc.generatedBy === 'AI') {
      // Fork the AI generation to preserve history
      const parentId = doc.parentId || doc.id;

      let latestVersionNum = doc.version;
      if (doc.children && doc.children.length > 0) {
        const maxChildVersion = Math.max(...doc.children.map((c) => c.version));
        latestVersionNum = Math.max(latestVersionNum, maxChildVersion);
      }

      const forkedDoc = await documentRepository.create({
        userId,
        title: doc.title,
        documentType: doc.documentType,
        status: DocumentStatus.DRAFT,
        content: { text } as Prisma.InputJsonValue,
        version: latestVersionNum + 1,
        generatedBy: 'USER',
        parentId,
        folderId: doc.folderId || undefined,
      });

      await this.logActivity(forkedDoc.id, ActivityType.EDITED);
      return forkedDoc;
    } else {
      // Save changes directly to user version
      const updated = await documentRepository.update(id, userId, {
        content: { text } as Prisma.InputJsonValue,
        status: DocumentStatus.DRAFT,
      });

      await this.logActivity(id, ActivityType.EDITED);
      return updated;
    }
  }

  /**
   * Regenerates a document by creating a new version.
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
    const doc = await documentRepository.findById(documentId, userId);
    if (!doc) {
      throw new ApiError(404, 'Document not found.');
    }
    this.verifyState(doc);

    const check = await this.validateProfile(userId);
    if (!check.isValid) {
      throw new ApiError(400, 'Student profile is incomplete.', {
        missingFields: check.missingFields,
      });
    }

    const parentId = doc.parentId || doc.id;

    let latestVersionNum = doc.version;
    if (doc.children && doc.children.length > 0) {
      const maxChildVersion = Math.max(...doc.children.map((c) => c.version));
      latestVersionNum = Math.max(latestVersionNum, maxChildVersion);
    }

    const newDoc = await documentRepository.create({
      userId,
      title: doc.title,
      documentType: doc.documentType,
      status: DocumentStatus.PENDING,
      version: latestVersionNum + 1,
      parentId,
      folderId: doc.folderId || undefined,
    });

    try {
      await documentRepository.update(newDoc.id, userId, {
        status: DocumentStatus.GENERATING,
      });

      const template = templateRegistry.resolve(doc.documentType, '1.0.0');
      const feedback = options.feedbackInstructions
        ? `\n\nRevision request: ${options.feedbackInstructions}`
        : '';

      const response = await aiEngine.generate(userId, {
        provider: options.provider,
        modelOverride: options.modelOverride,
        template,
        variables: {
          additionalInstructions: feedback,
        },
      });

      const updatedDoc = await documentRepository.update(newDoc.id, userId, {
        status: DocumentStatus.COMPLETED,
        content: { text: response.text } as Prisma.InputJsonValue,
        promptVersion: '1.0.0',
        provider: response.provider,
        model: response.model,
        requestId: response.requestId,
      });

      await this.logActivity(newDoc.id, ActivityType.REGENERATED);
      return updatedDoc;
    } catch (err) {
      await documentRepository.update(newDoc.id, userId, {
        status: DocumentStatus.FAILED,
      });
      throw err;
    }
  }

  /**
   * Restores a historic version of a document.
   */
  public async restoreVersion(
    userId: string,
    documentId: string,
    targetVersionId: string
  ): Promise<Document> {
    const doc = await documentRepository.findById(documentId, userId);
    if (!doc) {
      throw new ApiError(404, 'Document not found.');
    }
    this.verifyState(doc);

    // Resolve target version
    const targetDoc = await prisma.document.findFirst({
      where: { id: targetVersionId, userId, deletedAt: null },
    });
    if (!targetDoc) {
      throw new ApiError(404, 'Target version not found.');
    }

    const parentId = doc.parentId || doc.id;

    let latestVersionNum = doc.version;
    if (doc.children && doc.children.length > 0) {
      const maxChildVersion = Math.max(...doc.children.map((c) => c.version));
      latestVersionNum = Math.max(latestVersionNum, maxChildVersion);
    }

    const restoredDoc = await documentRepository.create({
      userId,
      title: doc.title,
      documentType: doc.documentType,
      status: DocumentStatus.DRAFT,
      content: targetDoc.content || undefined,
      version: latestVersionNum + 1,
      generatedBy: 'USER',
      parentId,
      folderId: doc.folderId || undefined,
    });

    await this.logActivity(restoredDoc.id, ActivityType.RESTORED, {
      versionRestored: targetDoc.version,
    });

    return restoredDoc;
  }

  /**
   * Logs a document activity timeline event.
   */
  public async logActivity(
    documentId: string,
    activityType: ActivityType,
    metadata?: Prisma.InputJsonValue
  ): Promise<void> {
    await prisma.documentActivity.create({
      data: {
        documentId,
        activityType,
        metadata: metadata || undefined,
      },
    });
  }

  /**
   * Calculates and returns detailed generation statistics for a document.
   * Cached for 60 seconds to avoid duplicate db queries.
   */
  public async getAnalyticsCached(
    userId: string,
    documentId: string
  ): Promise<{
    provider: string;
    model: string;
    promptVersion: string;
    latency: number;
    tokens: number;
    cost: number;
    summary: {
      averageLatency: number;
      generationsCount: number;
      averageTokens: number;
      totalPromptTokens: number;
      totalCompletionTokens: number;
      totalEstimatedCost: number;
    };
  }> {
    const cacheKey = `${userId}:${documentId}`;
    const cached = analyticsCache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const doc = await documentRepository.findById(documentId, userId);
    if (!doc) {
      throw new ApiError(404, 'Document not found.');
    }

    const parentId = doc.parentId || doc.id;

    // Load active child records to find all requestIds
    const allVersions = await prisma.document.findMany({
      where: {
        OR: [{ id: parentId }, { parentId }],
        deletedAt: null,
      },
      select: { requestId: true },
    });

    const requestIds = allVersions.map((v) => v.requestId).filter(Boolean) as string[];

    // Fetch related generations
    const generations = await prisma.aIGeneration.findMany({
      where: {
        requestId: { in: requestIds },
      },
    });

    let totalPrompt = 0;
    let totalCompletion = 0;
    let totalLatency = 0;
    let totalCost = 0;

    generations.forEach((gen) => {
      totalPrompt += gen.promptTokens || 0;
      totalCompletion += gen.completionTokens || 0;
      totalLatency += gen.latency || 0;
      totalCost += getProviderCost(
        gen.provider || '',
        gen.modelUsed || '',
        gen.promptTokens || 0,
        gen.completionTokens || 0
      );
    });

    const summary = {
      averageLatency: generations.length > 0 ? Math.round(totalLatency / generations.length) : 0,
      generationsCount: generations.length,
      averageTokens:
        generations.length > 0
          ? Math.round((totalPrompt + totalCompletion) / generations.length)
          : 0,
      totalPromptTokens: totalPrompt,
      totalCompletionTokens: totalCompletion,
      totalEstimatedCost: Number(totalCost.toFixed(6)),
    };

    // Find active version generation details
    const activeGen = generations.find((g) => g.requestId === doc.requestId);

    const result = {
      provider: activeGen?.provider || doc.provider || 'N/A',
      model: activeGen?.modelUsed || doc.model || 'N/A',
      promptVersion: doc.promptVersion || '1.0.0',
      latency: activeGen?.latency || 0,
      tokens: (activeGen?.promptTokens || 0) + (activeGen?.completionTokens || 0),
      cost: activeGen
        ? getProviderCost(
            activeGen.provider || '',
            activeGen.modelUsed || '',
            activeGen.promptTokens || 0,
            activeGen.completionTokens || 0
          )
        : 0.0,
      summary,
    };

    analyticsCache.set(cacheKey, {
      data: result,
      expiresAt: now + 60 * 1000, // 60 seconds expiration TTL
    });

    return result;
  }

  /**
   * Retrieves a single document by its ID.
   */
  public async getDocument(userId: string, id: string): Promise<Document> {
    const doc = await documentRepository.findById(id, userId);
    if (!doc) {
      throw new ApiError(404, 'Document not found.');
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
    return documentRepository.softDelete(id, userId);
  }

  /**
   * Updates isPinned/isFavorite properties after checking ownership.
   */
  public async updateMetadata(
    userId: string,
    id: string,
    updates: {
      isPinned?: boolean;
      isFavorite?: boolean;
      folderId?: string | null;
      tags?: string[];
      status?: DocumentStatus;
    }
  ): Promise<Document> {
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc || doc.userId !== userId) {
      throw new ApiError(404, 'Document not found.');
    }
    this.verifyState(doc);

    // Verify folder ownership if moving
    if (updates.folderId) {
      const folder = await prisma.folder.findUnique({ where: { id: updates.folderId } });
      if (!folder || folder.userId !== userId) {
        throw new ApiError(404, 'Folder not found.');
      }
    }

    const data: Prisma.DocumentUpdateInput = {};
    if (updates.isPinned !== undefined) {
      data.isPinned = updates.isPinned;
    }
    if (updates.isFavorite !== undefined) {
      data.isFavorite = updates.isFavorite;
    }
    if (updates.folderId !== undefined) {
      data.folder = updates.folderId ? { connect: { id: updates.folderId } } : { disconnect: true };
    }
    if (updates.tags) {
      data.tags = updates.tags;
    }
    if (updates.status) {
      data.status = updates.status;
      // Log workflow status updates
      await this.logActivity(
        id,
        updates.status === DocumentStatus.FINAL ? ActivityType.FINALIZED : ActivityType.ARCHIVED
      );
    }

    return documentRepository.update(id, userId, data);
  }
}

export const documentService = new DocumentService();
export default documentService;
