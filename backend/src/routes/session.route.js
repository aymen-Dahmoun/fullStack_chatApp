import express from "express";
import { getSession } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/session", getSession);


export default router;
