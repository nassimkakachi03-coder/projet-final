import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Adresse email invalide'),
    phone: z.string().trim().optional().or(z.literal('')),
    subject: z.string().trim().min(3, "L'objet doit contenir au moins 3 caractères").optional().or(z.literal('')),
    message: z.string().trim().min(10, 'Le message doit contenir au moins 10 caractères'),
  }),
});
