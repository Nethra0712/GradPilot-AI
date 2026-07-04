import { CreateDocumentInput, DocumentFilters, UpdateDocumentInput } from '@/types/document.types';
import { Document } from '@prisma/client';

/**
 * DocumentService
 *
 * Business logic layer for the Document domain.
 * Orchestrates document CRUD, soft-delete lifecycle, and quota checks.
 * Quota enforcement logic (Free tier limits) will be integrated here when
 * the SubscriptionService is implemented in Sprint 5.
 */
export class DocumentService {
  /**
   * Get a single document by ID.
   * Will verify that the requesting user owns the document (authorization check).
   */
  async getDocumentById(_id: string, _requestingUserId: string): Promise<Document | null> {
    throw new Error('Not implemented');
  }

  /**
   * List all documents for a user with optional filters.
   * Soft-deleted documents are excluded by default.
   */
  async listDocuments(_filters: DocumentFilters): Promise<Document[]> {
    throw new Error('Not implemented');
  }

  /**
   * Create a new document for a user.
   * Will enforce per-plan quotas (e.g. Free tier: 1 active application) when implemented.
   */
  async createDocument(_data: CreateDocumentInput): Promise<Document> {
    throw new Error('Not implemented');
  }

  /**
   * Update a document's content or status.
   * Will verify ownership before applying the update.
   */
  async updateDocument(
    _id: string,
    _data: UpdateDocumentInput,
    _requestingUserId: string
  ): Promise<Document> {
    throw new Error('Not implemented');
  }

  /**
   * Soft-delete a document.
   * Sets `deletedAt` to now. The document remains in the database and can be recovered.
   */
  async deleteDocument(_id: string, _requestingUserId: string): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * Restore a soft-deleted document.
   * Clears the `deletedAt` field.
   */
  async restoreDocument(_id: string, _requestingUserId: string): Promise<Document> {
    throw new Error('Not implemented');
  }
}

export const documentService = new DocumentService();
