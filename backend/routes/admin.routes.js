import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/adminAuth.middleware.js";
import { 
    getPendingUpdates, 
    approveUpdate, 
    rejectUpdate,
    getPendingUsers,
    approveUser,
    rejectUser
} from "../controllers/admin.controller.js";

const router = Router();

// Protect all admin routes
router.use(verifyJWT, verifyAdmin);

router.route("/pending").get(getPendingUpdates);
router.route("/approve/:id").post(approveUpdate);
router.route("/reject/:id").post(rejectUpdate);

router.route("/users/pending").get(getPendingUsers);
router.route("/users/approve/:id").post(approveUser);
router.route("/users/reject/:id").post(rejectUser);

export default router;
