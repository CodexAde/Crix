import { Router } from "express";
import { streamChat, getChatHistory } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/chat/:topicId", getChatHistory);
router.post("/chat", streamChat);

export default router;
