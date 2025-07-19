import express from "express";
import { getChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/:conversationId", getChat);


export default router;
