import { z } from 'zod';

const invoiceItemSchema = z.object({
  description: z.string().trim().min(2, 'La description est requise.'),
  cost: z.number().min(0, 'Le montant doit être positif.'),
});

export const createInvoiceSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, 'Le patient est requis.'),
    patientName: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, 'Ajoutez au moins une ligne de facturation.'),
    totalAmount: z.number().min(0, 'Le montant total doit être positif.'),
    currency: z.literal('DZD').optional(),
    status: z.enum(['Pending', 'Paid', 'Overdue', 'Cancelled']).optional(),
  }),
});

export const createPaymentSchema = z.object({
  body: z.object({
    invoiceId: z.string().min(1, 'La facture est requise.'),
    amount: z.number().positive('Le montant payé doit être supérieur à zéro.'),
    currency: z.literal('DZD').optional(),
    method: z.enum(['Cash', 'Credit Card', 'Bank Transfer']),
    date: z.string().optional(),
  }),
});
