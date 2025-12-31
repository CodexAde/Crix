import { Subject, Progress } from "../models/syllabus.model.js";
import mongoose from "mongoose";

const getSubjects = async (req, res) => {
    try {
        const userYear = req.user?.academicInfo?.year;
        const userBranch = req.user?.academicInfo?.branch;

        const totalCount = await Subject.countDocuments();
        
        const filter = {};
        
        // Year filtering - try to be robust
        if (userYear !== undefined && userYear !== null && userYear !== 0) {
            filter.year = Number(userYear);
        } else if (req.query.year) {
            filter.year = Number(req.query.year);
        }

        // Branch filtering
        // if (userBranch) {
        //     filter.$or = [
        //         // { branch: userBranch }, 
        //         { branch: "All" }
        //     ];
        // } else if (req.query.branch) {
        //     filter.branch = req.query.branch;
        // }

        const subjects = await Subject.aggregate([
            { $match: filter },
            {
                $project: {
                    name: 1,
                    code: 1,
                    image: 1,
                    branch: 1,
                    year: 1,
                    description: 1,
                    unitCount: { $size: { $ifNull: ["$units", []] } }
                }
            }
        ]);
        
        // console.log(`[Syllabus] DB Total: ${totalCount}, Filtered: ${subjects.length} for Year: ${filter.year}, Branch: ${userBranch || 'Any'}`);

        return res.status(200).json({ subjects });
    } catch (error) {
        console.error("[Syllabus Error]", error);
        return res.status(500).json({ message: error.message });
    }
};

const getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findById(id)
            .select("name code image units")
            .select("-units.chapters.description -units.chapters.topics.content -units.chapters.topics.description");
        
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
