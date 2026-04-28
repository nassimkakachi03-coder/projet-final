import { z } from 'zod';

const medicationSchema = z.object({
  name: z.string().trim().min(2, 'Le nom du médicament est requis.'),
  dosage: z.string().trim().min(1, 'Le dosage est requis.'),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  instructions: z.string().optional(),
});

export const createPrescriptionSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, 'Le patient est requis.'),
    doctorId: z.string().optional(),
    patientName: z.string().optional(),
    doctorName: z.string().optional(),
    medications: z.array(medicationSchema).min(1, 'Ajoutez au moins un médicament.'),
    date: z.string().optional(),
    notes: z.string().optional(),
  }),
});
