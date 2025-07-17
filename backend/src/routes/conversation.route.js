import { Router } from "express";

import { getConversations } from "../controllers/message.controller.js";
const router = Router();
router.get("/:userId", getConversations);

export default router;