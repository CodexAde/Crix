import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },
        isUsed: {
            type: Boolean,
            default: false
        },
        usedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

export const Referral = mongoose.model("Referral", referralSchema);
