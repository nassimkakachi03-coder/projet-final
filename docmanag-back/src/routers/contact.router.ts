import { Router } from "express";
import * as contactHandler from "../handlers/contact.handler.js";
import { validateRequest } from "../middlewares/validate.js";
import { createContactSchema } from "../validation/contact.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

// Public route — landing page submissions
router.post("/", validateRequest(createContactSchema), contactHandler.create);

// Protected routes — admin only
router.get("/", authenticate, contactHandler.getAll);
router.put("/:id/read", authenticate, contactHandler.markRead);
router.delete("/:id", authenticate, contactHandler.remove);

export default router;
