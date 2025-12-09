import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, updateOnboardingDetails, updateUserProfile } from "../controllers/user.controller.js";
import { googleAuth, googleAuthCallback } from "../controllers/googleAuth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Google Auth
router.route("/auth/google").get(googleAuth);
router.route("/auth/google/callback").get(googleAuthCallback);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/onboarding").post(verifyJWT, updateOnboardingDetails);
router.route("/profile").put(verifyJWT, updateUserProfile);

export default router;
