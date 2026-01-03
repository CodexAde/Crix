import { asyncHandler } from "../utils/Constructors/asyncHandler.js";
import { ApiError } from "../utils/Constructors/ApiError.js";
import { ApiResponse } from "../utils/Constructors/ApiResponse.js";
import { PendingUpdate } from "../models/pendingUpdate.model.js";
import { Subject } from "../models/syllabus.model.js";

const getPendingUpdates = asyncHandler(async (req, res) => {
    const updates = await PendingUpdate.find({ status: 'pending' })
        .populate('requestedBy', 'name email avatar')
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, updates, "Pending updates fetched successfully"));
});

const approveUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const update = await PendingUpdate.findById(id);
    if (!update) {
        throw new ApiError(404, "Update request not found");
    }

    if (update.status !== 'pending') {
        throw new ApiError(400, "Request is already processed");
    }

    // PROCESS THE UPDATE BASED ON TYPE
    if (update.type === 'ADD_CHAPTERS') {
        const { subjectId, unitNumber, chapters } = update.data;

        // Find Subject
        const subject = await Subject.findById(subjectId);
        if (!subject) {
             throw new ApiError(404, "Target subject not found");
        }

        // Find Unit
        const unitIndex = subject.units.findIndex(u => u.unitNumber === parseInt(unitNumber));
        if (unitIndex === -1) {
            throw new ApiError(404, "Target unit not found");
        }

        // Add Chapters logic (Moved from chapter controller)
        const existingChaptersCount = subject.units[unitIndex].chapters.length;
        
        const newChapters = chapters.map((chapter, idx) => ({
            ...chapter,
            orderIndex: existingChaptersCount + idx + 1,
            topics: chapter.topics.map((topic, tidx) => ({
                ...topic,
                orderIndex: tidx + 1
            }))
        }));
        
        subject.units[unitIndex].chapters.push(...newChapters);
        await subject.save();
    }

    // Mark as approved
    update.status = 'approved';
    await update.save();

    return res
        .status(200)
        .json(new ApiResponse(200, update, "Request approved and processed successfully"));
});

const rejectUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const update = await PendingUpdate.findById(id);
    if (!update) {
        throw new ApiError(404, "Update request not found");
    }

    if (update.status !== 'pending') {
        throw new ApiError(400, "Request is already processed");
    }

    update.status = 'rejected';
    await update.save(); 

    return res
        .status(200)
        .json(new ApiResponse(200, update, "Request rejected successfully"));
});

export {
    getPendingUpdates,
    approveUpdate,
    rejectUpdate
};
