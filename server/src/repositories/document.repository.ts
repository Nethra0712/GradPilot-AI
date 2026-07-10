import prisma from '@/prisma/client';
import { Document, DocumentType, DocumentStatus, Prisma } from '@prisma/client';

/**
 * DocumentRepository
 *
 * Data-access layer for the Document model.
 * Excludes soft-deleted records (deletedAt !== null) from general lookups.
 */
export class DocumentRepository {
  /**
   * Creates a new document record.
   */
  public async create(data: {
    userId: string;
    title: string;
    documentType: DocumentType;
    status: DocumentStatus;
    content?: Prisma.InputJsonValue;
    version?: number;
    parentId?: string;
    promptVersion?: string;
    provider?: string;
    model?: string;
    requestId?: string;
    generatedBy?: string;
  }): Promise<Document> {
    return prisma.document.create({
      data,
    });
  }

  /**
   * Updates an existing document record.
   */
  public async update(id: string, data: Prisma.DocumentUpdateInput): Promise<Document> {
    return prisma.document.update({
      where: { id },
      data,
    });
  }

  /**
   * Finds a document by its ID (if not soft-deleted).
   */
  public async findById(id: string): Promise<(Document & { children?: Document[] }) | null> {
    return prisma.document.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        children: {
          where: { deletedAt: null },
          orderBy: { version: 'asc' },
        },
      },
    }) as Promise<(Document & { children?: Document[] }) | null>;
  }

  /**
   * Lists all primary documents for a user (parentId is null, and not soft-deleted).
   * Sorted by updated time.
   */
  public async findByUserId(userId: string): Promise<Document[]> {
    return prisma.document.findMany({
      where: {
        userId,
        parentId: null,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  /**
   * Soft-deletes a document. If it is a parent document, also soft-deletes its history (children).
   */
  public async softDelete(id: string): Promise<Document> {
    const now = new Date();

    // Soft delete child history versions as well
    await prisma.document.updateMany({
      where: { parentId: id },
      data: { deletedAt: now },
    });

    return prisma.document.update({
      where: { id },
      data: { deletedAt: now },
    });
  }
}

export const documentRepository = new DocumentRepository();
export default documentRepository;
