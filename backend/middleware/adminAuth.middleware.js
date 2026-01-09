import { ApiError } from "../utils/Constructors/ApiError.js";
import { asyncHandler } from "../utils/Constructors/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Unauthorized request");
    }

    // Check if user is admin (hardcoded email check as per plan, or add role field later)
    const ADMIN_EMAILS = ["ade@admin.crix", "admin@crix.com"];
    
    // Also check for 'admin' role if we add it to schema later, 
    // but for now relying on specific seed email
    const isAdmin = ADMIN_EMAILS.includes(user.email) || user.role === 'admin';

    if (!isAdmin) {
        throw new ApiError(403, "Access denied. Admin resources only.");
    }

    next();
});
