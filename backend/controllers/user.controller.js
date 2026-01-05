import { User } from "../models/user.model.js";
import { Referral } from "../models/referral.model.js";
import { asyncHandler } from "../utils/Constructors/asyncHandler.js";
import { ApiError } from "../utils/Constructors/ApiError.js";
import { ApiResponse } from "../utils/Constructors/ApiResponse.js";
import mongoose from "mongoose";

const generateAccessAndRefresTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Something went wrong while generating referesh and access token");
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, referralCode } = req.body;

        if ([name, email, password, referralCode].some(field => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(409).json({ message: "User with email already exists" });
        }

        // Validate Referral Code
        const referral = await Referral.findOne({ code: referralCode.toUpperCase(), isUsed: false });
        
        if (!referral) {
            return res.status(400).json({ message: "Invalid or already used referral code" });
        }

        const user = await User.create({
            name,
            email,
            password,
            referralCode: referralCode.toUpperCase(),
            academicInfo: { isOnboarded: false } // Default
        });

        // Mark referral code as used
        referral.isUsed = true;
        referral.usedBy = user._id;
        await referral.save();

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            return res.status(500).json({ message: "Something went wrong while registering the user" });
        }

        // Auto login after register
        const { accessToken, refreshToken } = await generateAccessAndRefresTokens(createdUser._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        };

        return res.status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                user: createdUser,
                accessToken,
                refreshToken,
                message: "User registered Successfully"
            });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and password is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefresTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                user: loggedInUser,
                accessToken,
                refreshToken,
                message: "User logged In Successfully"
            });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // removes the field from document
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "User logged out" });
};

const getCurrentUser = async (req, res) => {
    // Determine Streak
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    const lastActivity = user.lastActivity ? new Date(user.lastActivity) : new Date(0);
    
    // Normalize dates to midnight to compare days only
    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);
    
    const lastActivityMidnight = new Date(lastActivity);
    lastActivityMidnight.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(todayMidnight - lastActivityMidnight);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // Streak Logic
    if (diffDays === 1) {
        // Logged in yesterday -> Increment
        user.streak = (user.streak || 0) + 1;
    } else if (diffDays > 1) {
        // Missed a day (or more) -> Reset
        // But if streak is 0 and it's their first time in a while, set to 1
        user.streak = 1;
    } else if (diffDays === 0) {
        // Login same day -> No change, but ensure at least 1 if 0
        if (!user.streak) user.streak = 1;
    }

    user.lastActivity = today;
    await user.save({ validateBeforeSave: false });

    // Update req.user to reflect changes if needed downstream, mostly for response
    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.refreshToken;

    return res.status(200).json({
        user: updatedUser,
        message: "User fetched successfully"
    });
};

const updateOnboardingDetails = async (req, res) => {
    try {
        const { college, branch, year, gender, personaProfile, referralCode } = req.body;
        
        // Simple validation
        if(!branch || !year) {
             return res.status(400).json({ message: "Branch and Year are required" });
        }

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ... (referral logic remains same) ...
        if (!user.referralCode) {
            if (!referralCode) {
                return res.status(400).json({ message: "Referral code is required for registration" });
            }

            const referral = await Referral.findOne({ code: referralCode.toUpperCase(), isUsed: false });
            
            if (!referral) {
                return res.status(400).json({ message: "Invalid or already used referral code" });
            }

            user.referralCode = referralCode.toUpperCase();
            
            // Mark referral code as used
            referral.isUsed = true;
            referral.usedBy = user._id;
            await referral.save();
        }

        user.academicInfo = {
            ...user.academicInfo, // preserve other fields if needed
            college, 
            branch, 
            year, 
            gender,
            isOnboarded: true
        };
        
        if (personaProfile) {
            user.personaProfile = personaProfile;
        }

        await user.save();

        return res.status(200).json({
            user,
            message: "Onboarding completed successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const { name, academicInfo, personaProfile } = req.body;
        
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update basic info
        if (name) user.name = name;

        // Update academicInfo safely
        if (academicInfo) {
            // If academicInfo is null/undefined in DB, init it
            if (!user.academicInfo) user.academicInfo = {};
            
            // Merge new fields into existing subdocument
            // This preserves Mongoose tracking and avoids spreading internal props
            Object.assign(user.academicInfo, academicInfo);
        }

        // Update persona profile
        if (personaProfile) {
            user.personaProfile = personaProfile;
        }

        await user.save();

        // Return updated user without sensitive info
        const updatedUser = await User.findById(user._id).select("-password -refreshToken");

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getCurrentUser, 
    updateOnboardingDetails,
    updateUserProfile,
    generateAccessAndRefresTokens,
    addUserSubject,
    getUserSubjects,
    reorderSubjects,
    getUserProfile,
    getFullUserProfile
};

const getUserProfile = asyncHandler(async (req, res) => {
    // Determine Streak (Logic moved here as this is the main entry point)
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User profile not found");
    }

    const today = new Date();
    const lastActivity = user.lastActivity ? new Date(user.lastActivity) : new Date(0);
    
    // Normalize dates to midnight
    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);
    
    const lastActivityMidnight = new Date(lastActivity);
    lastActivityMidnight.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(todayMidnight - lastActivityMidnight);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // Streak Logic
    if (diffDays === 1) {
        user.streak = (user.streak || 0) + 1;
    } else if (diffDays > 1) {
        user.streak = 1;
    } else if (diffDays === 0) {
        if (!user.streak) user.streak = 1;
    }

    user.lastActivity = today;
    await user.save({ validateBeforeSave: false });

    // Construct response object manually or via lean selection
    const responseUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        academicInfo: {
            isOnboarded: user.academicInfo?.isOnboarded,
            year: user.academicInfo?.year,
            branch: user.academicInfo?.branch
        },
        subjects: user.subjects,
        streak: user.streak
    };

    return res.status(200).json(
        new ApiResponse(200, responseUser, "User profile fetched successfully")
    );
});

const addUserSubject = async (req, res) => {
    try {
        const { subjectId } = req.body;
        
        if (!subjectId) {
            return res.status(400).json({ message: "Subject ID is required" });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { subjects: subjectId } },
            { new: true }
        ).select("-password -refreshToken").populate("subjects", "name code image");

        return res.status(200).json({ 
            message: "Subject added successfully", 
            subjects: user.subjects 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUserSubjects = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("subjects", "name code image year branch units");
        const validSubjects = user.subjects?.filter(s => s !== null) || [];
        
        // Update user if they have dead references to clean up DB
        if (user.subjects?.length !== validSubjects.length) {
            user.subjects = validSubjects.map(s => s._id);
            await user.save({ validateBeforeSave: false });
        }

        return res.status(200).json({ subjects: validSubjects });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const reorderSubjects = async (req, res) => {
    try {
        const { newOrder } = req.body;
        
        if (!newOrder || !Array.isArray(newOrder)) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { subjects: newOrder },
            { new: true }
        ).select("-password -refreshToken").populate("subjects", "name code image");

        return res.status(200).json({ 
            message: "Subjects reordered successfully", 
            subjects: user.subjects 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFullUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken").lean();

    if (!user) {
        throw new ApiError(404, "User profile not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Full user profile fetched successfully")
    );
});
