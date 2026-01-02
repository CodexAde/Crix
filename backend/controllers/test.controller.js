import { Test, AttemptedTest } from "../models/test.model.js";
import { asyncHandler } from "../utils/Constructors/asyncHandler.js";
import { ApiResponse } from "../utils/Constructors/ApiResponse.js";
import { ApiError } from "../utils/Constructors/ApiError.js";

const getTestByReference = asyncHandler(async (req, res) => {
    const { referenceId } = req.params;
    const test = await Test.findOne({ referenceId });

    if (!test) {
        return res.status(200).json(new ApiResponse(200, null, "No test found for this reference"));
    }

    // Check if already attempted
    const lastAttempt = await AttemptedTest.findOne({ 
        userId: req.user._id, 
        testId: test._id 
    }).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, { test, lastAttempt }, "Test fetched successfully"));
});

const getTestById = asyncHandler(async (req, res) => {
    const { testId } = req.params;
    const test = await Test.findById(testId);

    if (!test) {
        throw new ApiError(404, "Test not found");
    }

    return res.status(200).json(new ApiResponse(200, test, "Test fetched successfully"));
});

const submitTest = asyncHandler(async (req, res) => {
    const { testId, answers } = req.body;
    const userId = req.user._id;

    const test = await Test.findById(testId);
    if (!test) {
        throw new ApiError(404, "Test not found");
    }

    let score = 0;
    const gradedAnswers = answers.map(ans => {
        const question = test.questions.id(ans.questionId);
        const isCorrect = question.correctAnswer === ans.answer;
        if (isCorrect) score++;
        return {
            questionId: ans.questionId,
            answer: ans.answer,
            isCorrect,
            feedback: question.explanation
        };
    });

    const attemptedTest = await AttemptedTest.create({
        userId,
        testId,
        answers: gradedAnswers,
        score,
        totalQuestions: test.questions.length,
        analysis: `You scored ${score}/${test.questions.length}. ${score === test.questions.length ? "Excellent work! You have mastered this topic." : "Good effort! Review the explanations for the ones you missed."}`
    });

    return res.status(201).json(new ApiResponse(201, attemptedTest, "Test submitted successfully"));
});

const getLatestAttempt = asyncHandler(async (req, res) => {
    const { testId } = req.params;
    const userId = req.user._id;

    const lastAttempt = await AttemptedTest.findOne({
        userId,
        testId
    }).sort({ createdAt: -1 });

    if (!lastAttempt) {
        return res.status(200).json(new ApiResponse(200, null, "No prior attempts found"));
    }

    return res.status(200).json(new ApiResponse(200, lastAttempt, "Latest attempt fetched successfully"));
});

export { getTestByReference, getTestById, submitTest, getLatestAttempt };
