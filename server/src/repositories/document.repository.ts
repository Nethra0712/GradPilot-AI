import prisma from '@/prisma/client';
import { Document, DocumentType, DocumentStatus, Prisma, DocumentActivity } from '@prisma/client';

/**
 * DocumentRepository
 *
 * Data-access layer for the Document model in Sprint 9.
 * Enforces ownership validations on all update/retrieve queries.
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
    folderId?: string;
  }): Promise<Document> {
    return prisma.document.create({
      data,
    });
  }

  /**
   * Updates an existing document record after verifying ownership.
   */
  public async update(
    id: string,
    userId: string,
    data: Prisma.DocumentUpdateInput
  ): Promise<Document> {
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc || doc.userId !== userId) {
      throw new Error('Document not found or access denied.');
    }

    return prisma.document.update({
      where: { id },
      data,
    });
  }

  /**
   * Finds a document by its ID after verifying ownership.
   */
  public async findById(
    id: string,
    userId: string
  ): Promise<(Document & { children?: Document[] }) | null> {
    const doc = await prisma.document.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        children: {
          where: { deletedAt: null },
          orderBy: { version: 'asc' },
        },
      },
    });

    return doc as (Document & { children?: Document[] }) | null;
  }

  /**
   * Lists all primary documents for a user (parentId is null, and not soft-deleted).
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
   * Performs advanced filters, sorting, and search matching.
   */
  public async search(
    userId: string,
    filters: {
      query?: string;
      type?: DocumentType;
      status?: DocumentStatus;
      tag?: string;
      folderId?: string;
      isPinned?: boolean;
      isFavorite?: boolean;
    },
    sort: {
      by: 'updatedAt' | 'title';
      order: 'asc' | 'desc';
    }
  ): Promise<Document[]> {
    const where: Prisma.DocumentWhereInput = {
      userId,
      parentId: null, // Search only primary root workspace items
      deletedAt: null,
    };

    if (filters.type) {
      where.documentType = filters.type;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.folderId) {
      where.folderId = filters.folderId === 'none' ? null : filters.folderId;
    }
    if (filters.isPinned !== undefined) {
      where.isPinned = filters.isPinned;
    }
    if (filters.isFavorite !== undefined) {
      where.isFavorite = filters.isFavorite;
    }
    if (filters.tag) {
      where.tags = {
        has: filters.tag,
      };
    }

    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: 'insensitive' } },
        {
          content: {
            path: ['text'],
            string_contains: filters.query,
          },
        },
      ];
    }

    return prisma.document.findMany({
      where,
      orderBy: {
        [sort.by]: sort.order,
      },
    });
  }

  /**
   * Soft-deletes a document and its child versions after verifying ownership.
   */
  public async softDelete(id: string, userId: string): Promise<Document> {
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc || doc.userId !== userId) {
      throw new Error('Document not found or access denied.');
    }

    const now = new Date();

    // Cascade soft delete to child versions
    await prisma.document.updateMany({
      where: { parentId: id },
      data: { deletedAt: now },
    });

    return prisma.document.update({
      where: { id },
      data: { deletedAt: now },
    });
  }

  /**
   * Fetches version history list with pagination.
   */
  public async findHistoryPaginated(
    id: string,
    userId: string,
    page: number,
    limit: number
  ): Promise<{ versions: Document[]; total: number }> {
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc || doc.userId !== userId) {
      throw new Error('Document not found or access denied.');
    }

    // History includes the parent itself plus all its children
    const parentId = doc.parentId || doc.id;

    const where: Prisma.DocumentWhereInput = {
      OR: [{ id: parentId }, { parentId: parentId }],
      deletedAt: null,
    };

    const total = await prisma.document.count({ where });

    const versions = await prisma.document.findMany({
      where,
      orderBy: { version: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { versions, total };
  }

  /**
   * Fetches chronological activity timeline entries with pagination.
   */
  public async findActivitiesPaginated(
    documentId: string,
    userId: string,
    page: number,
    limit: number
  ): Promise<{ activities: DocumentActivity[]; total: number }> {
    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc || doc.userId !== userId) {
      throw new Error('Document not found or access denied.');
    }

    const where = { documentId };
    const total = await prisma.documentActivity.count({ where });

    const activities = await prisma.documentActivity.findMany({
      where,
      orderBy: { createdAt: 'desc' }, // Newest first
      skip: (page - 1) * limit,
      take: limit,
    });

    return { activities, total };
  }
}

export const documentRepository = new DocumentRepository();
export default documentRepository;
