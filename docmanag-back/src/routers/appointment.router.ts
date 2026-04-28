import { Router } from 'express';
import * as appointmentHandler from '../handlers/appointment.handler.js';
import { validateRequest } from '../middlewares/validate.js';
import { createAppointmentSchema, updateAppointmentSchema } from '../validation/appointment.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(createAppointmentSchema), appointmentHandler.create);
router.get('/', appointmentHandler.getAll);
router.get('/:id', appointmentHandler.getOne);
router.put('/:id', validateRequest(updateAppointmentSchema), appointmentHandler.update);
router.delete('/:id', appointmentHandler.remove);

export default router;
