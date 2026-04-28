import { z } from 'zod';
export const createInventoryItemSchema = z.object({ body: z.any() });
export const updateInventoryItemSchema = z.object({ body: z.any() });
