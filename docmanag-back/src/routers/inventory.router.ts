import { Router } from 'express';
import * as inventoryHandler from '../handlers/inventory.handler.js';
import { validateRequest } from '../middlewares/validate.js';
import { createInventoryItemSchema, updateInventoryItemSchema } from '../validation/inventoryItem.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();
router.use(authenticate);

router.post('/', validateRequest(createInventoryItemSchema), inventoryHandler.create);
router.get('/', inventoryHandler.getAll);
router.put('/:id', validateRequest(updateInventoryItemSchema), inventoryHandler.update);
router.delete('/:id', inventoryHandler.remove);

export default router;
