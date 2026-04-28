import { z } from 'zod';
export const createCertificateSchema = z.object({ body: z.any() });
