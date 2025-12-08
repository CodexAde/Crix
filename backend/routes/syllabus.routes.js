import { Router } from "express";
import { getSubjects, getSubjectById } from "../controllers/syllabus.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Protect all routes

router.route("/").get(getSubjects);
router.route("/:id").get(getSubjectById);

export default router;
