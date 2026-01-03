import { Router } from "express";
import { getTestByReference, submitTest, getTestById, getLatestAttempt, getUserTestStats } from "../controllers/test.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Secure all test routes

router.route('/stats').get(getUserTestStats);
router.route("/reference/:referenceId").get(getTestByReference);
router.route("/:testId/latest-attempt").get(getLatestAttempt);
router.route("/:testId").get(getTestById);
router.route("/submit").post(submitTest);

export default router;
