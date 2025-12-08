import { Router } from "express";
import { streamChat } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/chat", streamChat);

export default router;
