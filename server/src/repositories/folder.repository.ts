import prisma from '@/prisma/client';
import { Folder } from '@prisma/client';

/**
 * FolderRepository
 *
 * Exposes CRUD methods for document folder spaces.
 * Enforces ownership checks on updates and deletions.
 */
export class FolderRepository {
  /**
   * Creates a new folder.
   */
  public async create(userId: string, name: string): Promise<Folder> {
    return prisma.folder.create({
      data: {
        userId,
        name,
      },
    });
  }

  /**
   * Updates folder name if owned by user.
   */
  public async update(id: string, userId: string, name: string): Promise<Folder> {
    // Enforce ownership validation
    const folder = await prisma.folder.findUnique({ where: { id } });
    if (!folder || folder.userId !== userId) {
      throw new Error('Folder not found or access denied.');
    }

    return prisma.folder.update({
      where: { id },
      data: { name },
    });
  }

  /**
   * Deletes folder if owned by user.
   */
  public async delete(id: string, userId: string): Promise<Folder> {
    // Enforce ownership validation
    const folder = await prisma.folder.findUnique({ where: { id } });
    if (!folder || folder.userId !== userId) {
      throw new Error('Folder not found or access denied.');
    }

    return prisma.folder.delete({
      where: { id },
    });
  }

  /**
   * Lists folders owned by user.
   */
  public async findByUserId(userId: string): Promise<Folder[]> {
    return prisma.folder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const folderRepository = new FolderRepository();
export default folderRepository;
