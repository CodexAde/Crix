import { Router } from "express";
import { generateChaptersFromImage, confirmChapters, getSubjectsForDropdown, createSubject, addUnit } from "../controllers/chapter.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.use(verifyJWT); // Protect all routes

// Get subjects for dropdown
router.get("/subjects", getSubjectsForDropdown);

// Create new subject
router.post("/subject", createSubject);

// Add new unit to subject
router.post("/unit", addUnit);

// Generate chapters from image (AI preview)
router.post("/generate", upload.single('image'), generateChaptersFromImage);

// Confirm and save chapters to database
router.post("/confirm", confirmChapters);

export default router;
