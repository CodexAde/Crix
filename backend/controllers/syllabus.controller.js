import { Subject, Progress } from "../models/syllabus.model.js";
import mongoose from "mongoose";

const getSubjects = async (req, res) => {
    try {
        const { year, branch } = req.query;
        // For now, if no query params, we fetch everything or filter by default
        // In real app, we use user's profile to filter
        
        const filter = {};
        if (year) filter.year = year;
        if (branch) filter.branch = branch;

        const subjects = await Subject.find(filter).select("-units.chapters"); // Exclude heavy chapters content for list view
        
        return res.status(200).json({ subjects });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findById(id);
        
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        return res.status(200).json({ subject });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUnitDetails = async (req, res) => {
    try {
        const { id, unitId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(unitId)) {
            return res.status(400).json({ message: "Invalid Subject or Unit ID" });
        }

        const subject = await Subject.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $project: {
                    name: 1,
                    code: 1,
                    unit: {
                        $filter: {
                            input: "$units",
                            as: "unit",
                            cond: { $eq: ["$$unit._id", new mongoose.Types.ObjectId(unitId)] }
                        }
                    }
                }
            }
        ]);

        if (!subject || subject.length === 0 || !subject[0].unit || subject[0].unit.length === 0) {
            return res.status(404).json({ message: "Unit not found" });
        }

        return res.status(200).json({ 
            subjectName: subject[0].name,
            subjectCode: subject[0].code,
            unit: subject[0].unit[0] 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { getSubjects, getSubjectById, getUnitDetails };
