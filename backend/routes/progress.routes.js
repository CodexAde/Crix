import { Router } from "express";
import { updateProgress, getSubjectProgress, getDashboardStats } from "../controllers/progress.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", updateProgress);
router.get("/stats", getDashboardStats);
router.get("/:subjectId", getSubjectProgress);

export default router;
