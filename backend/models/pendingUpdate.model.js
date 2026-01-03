import mongoose from "mongoose";

const pendingUpdateSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['ADD_CHAPTERS'], 
        required: true 
    },
    data: { 
        type: Object, 
        required: true 
    }, // Stores subjectId, unitNumber, chapters
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    requestedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

export const PendingUpdate = mongoose.model("PendingUpdate", pendingUpdateSchema);
