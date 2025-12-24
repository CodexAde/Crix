import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  generateRoadmapAI,
  saveRoadmap,
  getMyRoadmaps,
  deleteRoadmap,
} from "../controllers/roadmap.controller.js";

const router = Router();

// Protected routes
router.use(verifyJWT);

router.post("/generate-ai", generateRoadmapAI);
router.post("/save", saveRoadmap);
router.get("/my-roadmaps", getMyRoadmaps);
router.delete("/:id", deleteRoadmap);

export default router;
