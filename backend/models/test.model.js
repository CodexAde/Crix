import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [String], // Empty for subjective
    correctAnswer: { type: String, required: true },
    explanation: String,
    type: { type: String, enum: ['mcq', 'subjective'], default: 'mcq' }
});

const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    type: { type: String, enum: ['topic', 'chapter'], required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Topic ID or Chapter ID
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    questions: [questionSchema],
    duration: Number, // in minutes
}, { timestamps: true });

export const Test = mongoose.model("Test", testSchema);

const attemptedTestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    answers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        answer: String,
        isCorrect: Boolean,
        feedback: String // For subjective or detailed feedback
    }],
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, required: true },
    analysis: String,
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const AttemptedTest = mongoose.model("AttemptedTest", attemptedTestSchema);
