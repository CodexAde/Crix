import { Subject, Progress } from "../models/syllabus.model.js";

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

const getUnitContent = async (req, res) => {
   // This might be handled by getSubjectById already since we embed, 
   // but if payloads are huge we might want specific unit fetching.
   // For this prototype, getSubjectById is sufficient as it returns all units and chapters.
   return res.status(200).json({ message: "Use getSubjectById for now" });
};

export { getSubjects, getSubjectById };
