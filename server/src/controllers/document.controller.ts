import { Request, Response, NextFunction } from 'express';
import { DocumentType, DocumentStatus } from '@prisma/client';
import { documentService } from '../services/document.service';
import { documentRepository } from '../repositories/document.repository';
import { downloadService } from '../services/download.service';
import { generateSopSchema } from '../validators/document.validator';
import { ApiError } from '../utils/apiError';
import { z } from 'zod';

const saveEditsSchema = z.object({
  text: z.string(),
});

const restoreSchema = z.object({
  versionId: z.string().uuid(),
});

const metadataSchema = z.object({
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  folderId: z.string().uuid().nullable().optional(),
  tags: z.array(z.string()).optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
});

/**
 * DocumentController
 *
 * Exposes REST API handlers for document generation, search,
 * editing, pinning, paginated timelines, and cached metrics.
 */
export class DocumentController {
  /**
   * Generates a new SOP document.
   */
  public async generateSop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const validated = generateSopSchema.parse(req.body);

      const document = await documentService.generateDocument(userId, DocumentType.SOP, {
        provider: validated.provider,
        modelOverride: validated.modelOverride,
        title: validated.title,
        customVariables: validated.customVariables,
      });

      res.status(201).json({
        success: true,
        data: document,
        metadata: {
          documentType: document.documentType,
          version: document.version,
        },
        requestId: document.requestId || undefined,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Regenerates an existing SOP document.
   */
  public async regenerateSop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { documentId, feedbackInstructions, provider, modelOverride } = req.body;

      const document = await documentService.regenerateDocument(userId, documentId, {
        feedbackInstructions,
        provider,
        modelOverride,
      });

      res.status(201).json({
        success: true,
        data: document,
        metadata: {
          documentType: document.documentType,
          version: document.version,
        },
        requestId: document.requestId || undefined,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Saves manual edits. Forks if the document is AI-generated, or auto-saves otherwise.
   */
  public async saveEdits(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { id } = req.params;
      const { text } = saveEditsSchema.parse(req.body);

      const document = await documentService.saveUserEdits(userId, id, text);

      res.status(200).json({
        success: true,
        data: document,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Restores a document to a historic version.
   */
  public async restoreVersion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { id } = req.params;
      const { versionId } = restoreSchema.parse(req.body);

      const document = await documentService.restoreVersion(userId, id, versionId);

      res.status(200).json({
        success: true,
        data: document,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Searches primary documents using filters and sorting.
   */
  public async searchDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const query = req.query.query as string | undefined;
      const type = req.query.type as DocumentType | undefined;
      const status = req.query.status as DocumentStatus | undefined;
      const tag = req.query.tag as string | undefined;
      const folderId = req.query.folderId as string | undefined;
      const isPinned = req.query.isPinned ? req.query.isPinned === 'true' : undefined;
      const isFavorite = req.query.isFavorite ? req.query.isFavorite === 'true' : undefined;

      const sortBy = (req.query.sortBy === 'title' ? 'title' : 'updatedAt') as
        'title' | 'updatedAt';
      const sortOrder = (req.query.sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';

      const documents = await documentRepository.search(
        userId,
        { query, type, status, tag, folderId, isPinned, isFavorite },
        { by: sortBy, order: sortOrder }
      );

      res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetches paginated history list of a document.
   */
  public async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { id } = req.params;
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);

      const historyData = await documentRepository.findHistoryPaginated(id, userId, page, limit);

      res.status(200).json({
        success: true,
        data: historyData.versions,
        metadata: {
          total: historyData.total,
          page,
          limit,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetches paginated activity timeline.
   */
  public async getActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { id } = req.params;
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);

      const activityData = await documentRepository.findActivitiesPaginated(
        id,
        userId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: activityData.activities,
        metadata: {
          total: activityData.total,
          page,
          limit,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetches cached AI generation analytics metrics.
   */
  public async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { id } = req.params;
      const analytics = await documentService.getAnalyticsCached(userId, id);

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Exports document markdown string content.
   */
  public async exportDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { id } = req.params;
      const doc = await documentService.getDocument(userId, id);

      const contentObj = doc.content as unknown as { text?: string } | null;
      const markdownText = contentObj?.text || '';
      const buffer = await downloadService.exportToMarkdown(markdownText);

      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${doc.title.replace(/\s+/g, '_')}.md"`
      );
      res.send(buffer);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates tags, folder association, favorite/pin state, or status.
   */
  public async updateMetadata(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { id } = req.params;
      const validated = metadataSchema.parse(req.body);

      const document = await documentService.updateMetadata(userId, id, validated);

      res.status(200).json({
        success: true,
        data: document,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Lists all primary documents.
   */
  public async listDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const documents = await documentService.listDocuments(userId);

      res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetches document details by ID.
   */
  public async getDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { id } = req.params;
      const document = await documentService.getDocument(userId, id);

      res.status(200).json({
        success: true,
        data: document,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Soft-deletes a document.
   */
  public async deleteDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { id } = req.params;
      await documentService.deleteDocument(userId, id);

      res.status(200).json({
        success: true,
        data: { id },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const documentController = new DocumentController();
export default documentController;
