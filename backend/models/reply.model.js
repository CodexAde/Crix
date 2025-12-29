import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
    {
        topicId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true
        },
        action: {
            type: String, // e.g., 'Summarize', 'Give me 5 MCQs', 'Explain simpler'
            required: true,
            index: true
        },
        content: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Optimize for common queries
replySchema.index({ topicId: 1, action: 1 });

export const Reply = mongoose.model("Reply", replySchema);
