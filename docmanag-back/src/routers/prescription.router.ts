import { Router } from 'express';
import * as prescriptionHandler from '../handlers/prescription.handler.js';
import { validateRequest } from '../middlewares/validate.js';
import { createPrescriptionSchema } from '../validation/prescription.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();
router.use(authenticate);

router.post('/', validateRequest(createPrescriptionSchema), prescriptionHandler.create);
router.get('/', prescriptionHandler.getAll);
router.get('/:id', prescriptionHandler.getOne);
router.delete('/:id', prescriptionHandler.remove);

export default router;
