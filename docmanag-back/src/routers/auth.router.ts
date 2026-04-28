import { Router } from 'express';
import * as authHandler from '../handlers/auth.handler.js';
import { validateRequest } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), authHandler.register);
router.post('/login', validateRequest(loginSchema), authHandler.login);

// Only Admins can list all internal users/staff
router.get('/users', authenticate, authorize('Admin'), authHandler.getUsers);

export default router;
