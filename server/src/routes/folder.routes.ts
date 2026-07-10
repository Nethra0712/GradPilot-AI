import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { folderController } from '../controllers/folder.controller';

const router = Router();

router.use(authenticate);

/**
 * POST /api/folders
 * Creates a new folder.
 */
router.post('/', folderController.create);

/**
 * PUT /api/folders/:id
 * Renames a folder.
 */
router.put('/:id', folderController.update);

/**
 * DELETE /api/folders/:id
 * Deletes a folder.
 */
router.delete('/:id', folderController.delete);

/**
 * GET /api/folders
 * List folders owned by user.
 */
router.get('/', folderController.list);

export default router;
