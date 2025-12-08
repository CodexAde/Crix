import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    orderIndex: Number,
    content: String, // Markdown or HTML summary
});

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    topics: [topicSchema],
    orderIndex: Number
});

const unitSchema = new mongoose.Schema({
    unitNumber: { type: Number, required: true },
    title: { type: String, required: true },
    chapters: [chapterSchema], 
});

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: String,
    branch: { type: String, required: true }, // 'ME', 'CSE'
    year: { type: Number, required: true }, // 1
    units: [unitSchema],
    image: String, // Thumbnail URL
}, { timestamps: true });

export const Subject = mongoose.model("Subject", subjectSchema);

// Progress tracking
const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Linking to subdocument ID
    status: { 
        type: String, 
        enum: ['not_started', 'in_progress', 'completed', 'doubts'], 
        default: 'not_started' 
    },
    startedAt: Date,
    completedAt: Date
}, { timestamps: true });

// Compound index to ensure one progress entry per topic per user
progressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

export const Progress = mongoose.model("Progress", progressSchema);
