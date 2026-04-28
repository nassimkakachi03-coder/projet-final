import { z } from 'zod';

const appointmentBodySchema = z.object({
  patientId: z.string().min(1, 'Le patient est requis.'),
  doctorId: z.string().optional(),
  patientName: z.string().optional(),
  date: z.string().refine((value) => !Number.isNaN(new Date(value).getTime()), 'Date de rendez-vous invalide.'),
  reason: z.string().trim().min(2, 'Le motif doit contenir au moins 2 caractères.'),
  duration: z.number().int().min(5).max(480).optional(),
  status: z.enum(['EnCours', 'Termine', 'Scheduled', 'Completed', 'Cancelled', 'Pending']).optional(),
  notes: z.string().optional(),
});

export const createAppointmentSchema = z.object({ body: appointmentBodySchema });
export const updateAppointmentSchema = z.object({ body: appointmentBodySchema.partial() });
