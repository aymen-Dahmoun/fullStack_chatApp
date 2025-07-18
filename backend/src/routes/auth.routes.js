import express from "express";
import { register, login, getSession } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


export default router;
