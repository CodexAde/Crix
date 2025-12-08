import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topicId: {
        type: String,
        required: true
    },
    messages: [messageSchema]
}, { timestamps: true });

// Compound index for fast lookups
chatSchema.index({ userId: 1, topicId: 1 }, { unique: true });

export const Chat = mongoose.model('Chat', chatSchema);
