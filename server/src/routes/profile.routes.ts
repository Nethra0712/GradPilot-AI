import { Router } from 'express';
import { profileController } from '@/controllers/profile.controller';
import { authenticate } from '@/middleware/auth.middleware';

const router = Router();

// Secure all profile endpoints with user auth middleware
router.use(authenticate);

router.get('/', profileController.getProfile);
router.post('/', profileController.createProfile);
router.put('/', profileController.updateProfile);
router.delete('/', profileController.deleteProfile);

export default router;
