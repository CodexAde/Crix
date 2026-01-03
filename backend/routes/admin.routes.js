import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/adminAuth.middleware.js";
import { 
    getPendingUpdates, 
    approveUpdate, 
    rejectUpdate 
} from "../controllers/admin.controller.js";

const router = Router();

// Protect all admin routes
router.use(verifyJWT, verifyAdmin);

router.route("/pending").get(getPendingUpdates);
router.route("/approve/:id").post(approveUpdate);
router.route("/reject/:id").post(rejectUpdate);

export default router;
