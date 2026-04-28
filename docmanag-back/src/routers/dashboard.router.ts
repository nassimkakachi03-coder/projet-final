import { Router } from 'express';
import { getStats } from '../handlers/dashboard.handler.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', getStats);
router.get('/stats', getStats);  // alias for frontend compatibility

export default router;
