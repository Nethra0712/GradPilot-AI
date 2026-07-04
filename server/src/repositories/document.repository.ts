import { Document } from '@prisma/client';
import { CreateDocumentInput, DocumentFilters, UpdateDocumentInput } from '@/types/document.types';

/**
 * DocumentRepository
 *
 * Data-access layer for the Document model.
 * Implements soft-delete semantics: deleted documents have a non-null `deletedAt`
 * and are excluded from all standard list queries by default.
 * Hard deletes are never performed on documents to preserve audit history.
 */
export class DocumentRepository {
  /**
   * Find a single document by its ID.
   * Throws if the document is soft-deleted and includeDeleted is not true.
   */
  async findById(_id: string, _includeDeleted?: boolean): Promise<Document | null> {
    throw new Error('Not implemented');
  }

  /**
   * List all documents matching the given filters.
   * Excludes soft-deleted documents by default (includeDeleted: false).
   * Supports filtering by documentType and status.
   */
  async findMany(_filters: DocumentFilters): Promise<Document[]> {
    throw new Error('Not implemented');
  }

  /**
   * Create a new document record.
   * Called when the user begins a new application document.
   */
  async create(_data: CreateDocumentInput): Promise<Document> {
    throw new Error('Not implemented');
  }

  /**
   * Update the content or status of a document.
   * Called when the user edits their document or finalises it.
   */
  async update(_id: string, _data: UpdateDocumentInput): Promise<Document> {
    throw new Error('Not implemented');
  }

  /**
   * Soft-delete a document by setting `deletedAt` to the current timestamp.
   * The document remains in the database and can be recovered.
   */
  async softDelete(_id: string): Promise<Document> {
    throw new Error('Not implemented');
  }

  /**
   * Restore a soft-deleted document by clearing the `deletedAt` field.
   */
  async restore(_id: string): Promise<Document> {
    throw new Error('Not implemented');
  }

  /**
   * Count non-deleted documents belonging to a user.
   * Used for quota enforcement (e.g. Free tier limits active applications).
   */
  async countByUserId(_userId: string): Promise<number> {
    throw new Error('Not implemented');
  }
}

export const documentRepository = new DocumentRepository();
