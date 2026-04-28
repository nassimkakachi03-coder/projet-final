import { Router } from 'express';
import * as patientHandler from '../handlers/patient.handler.js';
import * as patientHistoryHandler from '../handlers/patientHistory.handler.js';
import { authenticate } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { createPatientSchema, updatePatientSchema } from '../validation/patient.js';

const router = Router();

router.post('/register', validateRequest(createPatientSchema), patientHandler.create);

router.use(authenticate);

router.post('/', validateRequest(createPatientSchema), patientHandler.create);
router.get('/', patientHandler.getAll);
router.get('/archives', patientHandler.getArchivedAll);
router.get('/archives/:archiveId', patientHandler.getArchivedOne);
router.get('/:id/history', patientHistoryHandler.getPatientHistory);
router.get('/:id', patientHandler.getOne);
router.put('/:id', validateRequest(updatePatientSchema), patientHandler.update);
router.delete('/:id', patientHandler.remove);

export default router;
