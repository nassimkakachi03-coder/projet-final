import { Router } from 'express';
import * as notificationHandler from '../handlers/notification.handler.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Only admin users should access these
router.use(authenticate, authorize('Admin', 'SuperAdmin', 'Doctor', 'Secretary'));

router.get('/', notificationHandler.getNotifications);
router.put('/read-all', notificationHandler.markAllAsRead);
router.delete('/all', notificationHandler.deleteAllNotifications);
router.put('/:id/read', notificationHandler.markAsRead);
router.delete('/:id', notificationHandler.deleteNotification);

export default router;
