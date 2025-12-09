import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        avatar: {
            type: String, // URL to profile picture
            default: ""
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        academicInfo: {
            college: String,
            branch: String, // CSE, ME, etc.
            year: Number, // 1
            universitySchema: String, // AKTU 2023
            targetExamDate: Date,
            isOnboarded: {
                type: Boolean,
                default: false
            }
        },
        refreshToken: {
            type: String
        },
        personaProfile: {
            type: Object, // Stores the JSON blob from the user
            default: null
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
        }
    );
};

export const User = mongoose.model("User", userSchema);
