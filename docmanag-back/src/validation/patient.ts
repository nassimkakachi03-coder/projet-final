import { z } from 'zod';

const optionalEmail = z.string().email('Adresse email invalide').optional().or(z.literal(''));
const optionalDate = z
  .string()
  .refine((date) => {
    if (!date) return true;
    const parsedDate = new Date(date);
    return !Number.isNaN(parsedDate.getTime()) && parsedDate <= new Date();
  }, 'Date invalide')
  .optional()
  .or(z.literal(''));

export const createPatientSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    phone: z.string().min(5, 'Numéro de téléphone invalide'),
    email: optionalEmail,
    source: z.enum(['admin', 'landing', 'patient-portal']).optional(),
    dateOfBirth: optionalDate,
    gender: z.enum(['Male', 'Female', '']).optional(),
    address: z.string().optional(),
    medicalHistory: z.string().optional(),
    caseSummary: z.string().optional(),
    careNotes: z.string().optional(),
    xRayUrl: z.string().optional(),
    prescriptionUrl: z.string().optional(),
  }),
});

export const updatePatientSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    phone: z.string().min(5).optional(),
    email: optionalEmail,
    source: z.enum(['admin', 'landing', 'patient-portal']).optional(),
    dateOfBirth: optionalDate,
    gender: z.enum(['Male', 'Female', '']).optional(),
    address: z.string().optional(),
    medicalHistory: z.string().optional(),
    caseSummary: z.string().optional(),
    careNotes: z.string().optional(),
    xRayUrl: z.string().optional(),
    prescriptionUrl: z.string().optional(),
  }),
});
