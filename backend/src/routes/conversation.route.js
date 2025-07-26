import { Router } from "express";

import { createConversation, getConversations } from "../controllers/message.controller.js";

const router = Router();
router.get("/:userId", getConversations);
router.post("/", createConversation)

export default router;