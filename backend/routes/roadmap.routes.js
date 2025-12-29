import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  generateRoadmapAI,
  saveRoadmap,
  getMyRoadmaps,
  getRoadmapById,
  deleteRoadmap,
} from "../controllers/roadmap.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/generate-ai", generateRoadmapAI);
router.post("/save", saveRoadmap);
router.get("/my-roadmaps", getMyRoadmaps);
router.get("/:id", getRoadmapById);
router.delete("/:id", deleteRoadmap);

export default router;
