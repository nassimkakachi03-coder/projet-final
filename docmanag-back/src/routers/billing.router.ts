import { Router } from 'express';
import * as billingHandler from '../handlers/billing.handler.js';
import { validateRequest } from '../middlewares/validate.js';
import { createInvoiceSchema, createPaymentSchema } from '../validation/billing.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();
router.use(authenticate);

// Invoices
router.post('/invoices', validateRequest(createInvoiceSchema), billingHandler.createInvoice);
router.get('/invoices', billingHandler.getAllInvoices);
router.put('/invoices/:id', billingHandler.updateInvoice);
router.delete('/invoices/:id', billingHandler.deleteInvoice);

// Payments
router.post('/payments', validateRequest(createPaymentSchema), billingHandler.payInvoice);
router.get('/payments', billingHandler.getAllPayments);

export default router;
