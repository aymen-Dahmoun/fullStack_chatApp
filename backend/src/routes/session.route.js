import express from "express";
import { getSession } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/session", getSession);


export default router;
