import { Router } from "express";
import { searchUser } from '../controllers/search.controller.js';


const router = Router();
router.get("/", searchUser);

export default router;
