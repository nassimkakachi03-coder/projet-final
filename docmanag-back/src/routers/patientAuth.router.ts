import { Router } from 'express';
import * as patientAuthHandler from '../handlers/patientAuth.handler.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/register', patientAuthHandler.register);
router.post('/login', patientAuthHandler.login);
router.get('/me', authenticate, patientAuthHandler.getMe);
router.get('/me/history', authenticate, patientAuthHandler.getMyHistory);
router.post('/appointment', authenticate, patientAuthHandler.createAppointment);
router.put('/me/medical-profile', authenticate, patientAuthHandler.updateMedicalProfile);

export default router;
