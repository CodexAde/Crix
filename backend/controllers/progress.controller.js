import { Progress } from "../models/syllabus.model.js";
import { Subject } from "../models/syllabus.model.js";

// Update or Create Progress
export const updateProgress = async (req, res) => {
    try {
        const { subjectId, topicId, status } = req.body;
        const userId = req.user._id;

        // Validation
        if (!['not_started', 'in_progress', 'completed', 'doubts'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        let progress = await Progress.findOne({ userId, topicId });

        if (progress) {
            progress.status = status;
            if (status === 'completed' && !progress.completedAt) {
                progress.completedAt = new Date();
            }
            await progress.save();
        } else {
            progress = await Progress.create({
                userId,
                subjectId,
                topicId,
                status,
                startedAt: new Date(),
                completedAt: status === 'completed' ? new Date() : null
            });
        }

        return res.status(200).json({ progress, message: "Progress updated" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get Progress for a Subject (to map over topics)
export const getSubjectProgress = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const userId = req.user._id;

        const progressList = await Progress.find({ userId, subjectId });
        
        // Convert to a map for easy lookup: { topicId: status }
        const progressMap = {};
        progressList.forEach(p => {
            progressMap[p.topicId] = p.status;
        });

        // Also calculate stats
        const totalCompleted = progressList.filter(p => p.status === 'completed').length;
        const totalDoubts = progressList.filter(p => p.status === 'doubts').length;

        return res.status(200).json({ 
            progressMap, 
            stats: { totalCompleted, totalDoubts } 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get overall dashboard stats
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // This is a simple aggregation. For scale, maintain counters on User model.
        const allProgress = await Progress.find({ userId });
        
        const totalCompleted = allProgress.filter(p => p.status === 'completed').length;
        const totalDoubts = allProgress.filter(p => p.status === 'doubts').length;
        // Streak would be calculated from created/updatedAt dates
        
        return res.status(200).json({
            topicsMastered: totalCompleted,
            activeDoubts: totalDoubts,
            streak: 1 // hardcoded for now or calculate from dates
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
