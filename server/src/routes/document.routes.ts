import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { documentController } from '../controllers/document.controller';

const router = Router();

// Enforce authentication on all document routes
router.use(authenticate);

/**
 * POST /api/documents/sop/generate
 * Creates a new Statement of Purpose.
 */
router.post('/sop/generate', documentController.generateSop);

/**
 * POST /api/documents/sop/regenerate
 * Creates a new version of an existing SOP using revision prompts.
 */
router.post('/sop/regenerate', documentController.regenerateSop);

/**
 * GET /api/documents
 * List all primary documents for the logged-in user.
 */
router.get('/', documentController.listDocuments);

/**
 * GET /api/documents/:id
 * Retrieve specific document details and history.
 */
router.get('/:id', documentController.getDocument);

/**
 * DELETE /api/documents/:id
 * Soft-delete a document and its child versions.
 */
router.delete('/:id', documentController.deleteDocument);

export default router;
