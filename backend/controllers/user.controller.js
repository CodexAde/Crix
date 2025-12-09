import { User } from "../models/user.model.js";

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
        const { name, email, password } = req.body;

        if ([name, email, password].some(field => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(409).json({ message: "User with email already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            academicInfo: { isOnboarded: false } // Default
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            return res.status(500).json({ message: "Something went wrong while registering the user" });
        }

        // Auto login after register
        const { accessToken, refreshToken } = await generateAccessAndRefresTokens(createdUser._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
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
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
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
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "User logged out" });
};

const getCurrentUser = async (req, res) => {
    return res.status(200).json({
        user: req.user,
        message: "User fetched successfully"
    });
};

const updateOnboardingDetails = async (req, res) => {
    try {
        const { college, branch, year, universitySchema, targetExamDate, personaProfile } = req.body;
        
        // Simple validation
        if(!branch || !year) {
             return res.status(400).json({ message: "Branch and Year are required" });
        }

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.academicInfo = {
            ...user.academicInfo, // preserve other fields if needed
            college, 
            branch, 
            year, 
            universitySchema, 
            targetExamDate,
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
    generateAccessAndRefresTokens
};
