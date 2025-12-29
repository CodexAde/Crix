import { Router } from "express";
import { getSubjects, getSubjectById, getUnitDetails } from "../controllers/syllabus.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Protect all routes

router.route("/").get(getSubjects);
router.route("/:id").get(getSubjectById);
router.route("/:id/unit/:unitId").get(getUnitDetails);

export default router;
