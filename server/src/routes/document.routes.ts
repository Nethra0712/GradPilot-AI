import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { documentController } from '../controllers/document.controller';

const router = Router();

// Enforce authentication on all document routes
router.use(authenticate);

/**
 * GET /api/documents/search
 * Advanced filters, search, and sorting.
 */
router.get('/search', documentController.searchDocuments);

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
 * POST /api/documents/:id/save
 * Saves manual text edits, with fork triggers.
 */
router.post('/:id/save', documentController.saveEdits);

/**
 * POST /api/documents/:id/restore
 * Restores a historic version of a document.
 */
router.post('/:id/restore', documentController.restoreVersion);

/**
 * GET /api/documents/:id/history
 * Fetches paginated version list.
 */
router.get('/:id/history', documentController.getHistory);

/**
 * GET /api/documents/:id/activities
 * Fetches paginated activitytimeline.
 */
router.get('/:id/activities', documentController.getActivities);

/**
 * GET /api/documents/:id/analytics
 * Fetches cached AI generation cost metrics.
 */
router.get('/:id/analytics', documentController.getAnalytics);

/**
 * GET /api/documents/:id/export
 * Downloads document as markdown payload.
 */
router.get('/:id/export', documentController.exportDocument);

/**
 * PUT /api/documents/:id/metadata
 * Updates tags, folder association, favorite/pin state, or status.
 */
router.put('/:id/metadata', documentController.updateMetadata);

/**
 * GET /api/documents
 * List all primary documents for the logged-in user.
 */
router.get('/', documentController.listDocuments);

/**
 * GET /api/documents/:id
 * Retrieve specific document details.
 */
router.get('/:id', documentController.getDocument);

/**
 * DELETE /api/documents/:id
 * Soft-delete a document and its child versions.
 */
router.delete('/:id', documentController.deleteDocument);

export default router;
