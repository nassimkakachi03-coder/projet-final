import { Router } from 'express';
import * as certificateHandler from '../handlers/certificate.handler.js';
import { validateRequest } from '../middlewares/validate.js';
import { createCertificateSchema } from '../validation/certificate.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();
router.use(authenticate);

router.post('/', validateRequest(createCertificateSchema), certificateHandler.create);
router.get('/', certificateHandler.getAll);
router.get('/:id', certificateHandler.getOne);
router.delete('/:id', certificateHandler.remove);

export default router;
