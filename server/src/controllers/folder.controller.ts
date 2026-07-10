import { Request, Response, NextFunction } from 'express';
import { folderRepository } from '../repositories/folder.repository';
import { ApiError } from '../utils/apiError';
import { z } from 'zod';

const folderSchema = z.object({
  name: z.string().min(1, 'Folder name cannot be empty').max(50, 'Folder name too long'),
});

/**
 * FolderController
 *
 * Exposes API handlers for Folder creation, list, and reresolving.
 */
export class FolderController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { name } = folderSchema.parse(req.body);
      const folder = await folderRepository.create(userId, name);

      res.status(201).json({
        success: true,
        data: folder,
      });
    } catch (err) {
      next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { id } = req.params;
      const { name } = folderSchema.parse(req.body);

      const folder = await folderRepository.update(id, userId, name);

      res.status(200).json({
        success: true,
        data: folder,
      });
    } catch (err) {
      next(err);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { id } = req.params;
      await folderRepository.delete(id, userId);

      res.status(200).json({
        success: true,
        data: { id },
      });
    } catch (err) {
      next(err);
    }
  }

  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const folders = await folderRepository.findByUserId(userId);

      res.status(200).json({
        success: true,
        data: folders,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const folderController = new FolderController();
export default folderController;
