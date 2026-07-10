import { Request, Response, NextFunction } from 'express';
import { DocumentType } from '@prisma/client';
import { documentService } from '../services/document.service';
import { generateSopSchema, regenerateSopSchema } from '../validators/document.validator';
import { ApiError } from '../utils/apiError';

/**
 * DocumentController
 *
 * Exposes API handlers for document generation pipelines,
 * resolving details and returning standard API envelopes.
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

      // Validate inputs
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
   * Regenerates an existing SOP document with revision notes.
   */
  public async regenerateSop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const validated = regenerateSopSchema.parse(req.body);

      const document = await documentService.regenerateDocument(userId, validated.documentId, {
        feedbackInstructions: validated.feedbackInstructions,
        provider: validated.provider,
        modelOverride: validated.modelOverride,
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
   * Lists all primary documents for the active user.
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
