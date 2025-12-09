import OpenAI from 'openai';
import { Subject } from "../models/syllabus.model.js";

// Initialize OpenAI client for OpenRouter
let openai = null;
const getOpenAI = () => {
    if (!openai) {
        openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer": process.env.FRONTEND_URL, // Site URL
                "X-Title": "Crix AI Tutor" // Site Name
            }
        });
    }
    return openai;
};

/**
 * Generate chapters and topics from a syllabus image using OpenRouter Vision
 * POST /api/v1/chapters/generate
 */
const generateChaptersFromImage = async (req, res) => {
    try {
        const { subjectId, unitNumber, syllabusText } = req.body;
        
        // Validation: Need either image OR text
        if (!req.file && !syllabusText) {
            return res.status(400).json({ success: false, message: "Either an image or syllabus text is required" });
        }
        
        if (!subjectId || !unitNumber) {
            return res.status(400).json({ success: false, message: "subjectId and unitNumber are required" });
        }
        
        let messages = [];
        let textResponse = "";
        
        if (req.file) {
            // IMAGE FLOW - Use a Non-Google Vision Model (Llama 3.2 Vision)
            const imageBase64 = req.file.buffer.toString('base64');
            const mimeType = req.file.mimetype;
            const dataUrl = `data:${mimeType};base64,${imageBase64}`;
            
            const prompt = `You are an expert syllabus analyzer. Analyze this syllabus/curriculum image and extract ALL chapters and their topics.

OUTPUT FORMAT - Return ONLY valid JSON, no markdown, no code blocks:
{
  "chapters": [
    {
      "title": "Chapter Title",
      "description": "Brief 1-line description of what this chapter covers",
      "orderIndex": 1,
      "topics": [
        {
          "title": "Topic Title",
          "description": "Brief 1-line description of this topic",
          "orderIndex": 1
        }
      ]
    }
  ]
}

RULES:
1. Extract ALL chapters visible in the image
2. For each chapter, extract ALL topics/subtopics listed
3. Keep titles concise but meaningful
4. Keep descriptions short (1 line max)
5. Maintain the order as shown in the syllabus
6. If topics aren't clearly listed, create logical subtopics based on chapter title
7. Return ONLY the JSON object, nothing else
8. Do not include any conversational text, strictly JSON.

Analyze the image now:`;

            // Use Llama 3.2 Vision (Free on OpenRouter) as requested (No Google)
            const response = await getOpenAI().chat.completions.create({
                model: "meta-llama/llama-3.2-11b-vision-instruct:free",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            { type: "image_url", image_url: { url: dataUrl } }
                        ]
                    }
                ],
                max_tokens: 4096
            });
            
            textResponse = response.choices[0]?.message?.content || "";

        } else {
            // TEXT FLOW - Use User Requested DeepSeek Model
            const prompt = `You are an expert syllabus analyzer. Analyze this syllabus text and extract ALL chapters and their topics.

SYLLABUS TEXT:
"${syllabusText}"

OUTPUT FORMAT - Return ONLY valid JSON, no markdown, no code blocks:
{
  "chapters": [
    {
      "title": "Chapter Title",
      "description": "Brief 1-line description of what this chapter covers",
      "orderIndex": 1,
      "topics": [
        {
          "title": "Topic Title",
          "description": "Brief 1-line description of this topic",
          "orderIndex": 1
        }
      ]
    }
  ]
}

RULES:
1. Extract ALL chapters from the text
2. For each chapter, extract ALL topics/subtopics listed
3. Keep titles concise but meaningful
4. Keep descriptions short (1 line max)
5. Maintain the order as shown in the syllabus
6. If topics aren't clearly listed, create logical subtopics based on chapter title
7. Return ONLY the JSON object, nothing else
8. Do not include any conversational text, strictly JSON.`;

            // Use requested DeepSeek Chimera model
            const response = await getOpenAI().chat.completions.create({
                model: "tngtech/deepseek-r1t2-chimera:free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 4096
            });
            
            textResponse = response.choices[0]?.message?.content || "";
        }
        
        let text = textResponse;
        
        // Clean up response - remove markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Parse the JSON
        let generatedData;
        try {
            generatedData = JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse AI response:", text);
            return res.status(500).json({ 
                success: false, 
                message: "AI returned invalid format. Please try again.",
                rawResponse: text 
            });
        }
        
        // Validate structure
        if (!generatedData.chapters || !Array.isArray(generatedData.chapters)) {
            return res.status(500).json({ 
                success: false, 
                message: "AI returned invalid data structure" 
            });
        }
        
        // Return preview data (NOT saved to DB yet)
        return res.status(200).json({
            success: true,
            preview: true,
            data: {
                subjectId,
                unitNumber: parseInt(unitNumber),
                chapters: generatedData.chapters
            },
            message: "Preview generated! Review and confirm to save."
        });
        
    } catch (error) {
        console.error("Generate Chapters Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to generate chapters" 
        });
    }
};

/**
 * Confirm and save generated chapters to database
 * POST /api/v1/chapters/confirm
 */
const confirmChapters = async (req, res) => {
    try {
        const { subjectId, unitNumber, chapters } = req.body;
        
        if (!subjectId || !unitNumber || !chapters) {
            return res.status(400).json({ 
                success: false, 
                message: "subjectId, unitNumber, and chapters are required" 
            });
        }
        
        // Find the subject
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        
        // Find the unit
        const unitIndex = subject.units.findIndex(u => u.unitNumber === parseInt(unitNumber));
        if (unitIndex === -1) {
            return res.status(404).json({ success: false, message: "Unit not found" });
        }
        
        // Add chapters to the unit (append to existing)
        const existingChaptersCount = subject.units[unitIndex].chapters.length;
        
        // Update orderIndex for new chapters
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
        
        return res.status(200).json({
            success: true,
            message: `${chapters.length} chapter(s) added successfully!`,
            data: {
                addedChapters: newChapters.length,
                totalChapters: subject.units[unitIndex].chapters.length
            }
        });
        
    } catch (error) {
        console.error("Confirm Chapters Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to save chapters" 
        });
    }
};

/**
 * Get all subjects for dropdown (lightweight)
 * GET /api/v1/chapters/subjects
 */
const getSubjectsForDropdown = async (req, res) => {
    try {
        const subjects = await Subject.find({}).select('name code units.unitNumber units.title image');
        return res.status(200).json({ success: true, subjects });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create a new subject
 * POST /api/v1/chapters/subject
 */
const createSubject = async (req, res) => {
    try {
        const { name, code, branch, year, image } = req.body;
        
        if (!name || !branch || !year) {
            return res.status(400).json({ 
                success: false, 
                message: "name, branch, and year are required" 
            });
        }
        
        // Check if subject with same code exists
        if (code) {
            const existing = await Subject.findOne({ code });
            if (existing) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Subject with this code already exists" 
                });
            }
        }
        
        const subject = await Subject.create({
            name,
            code: code || name.substring(0, 6).toUpperCase(),
            branch,
            year: parseInt(year),
            image: image || `https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800`,
            units: []
        });
        
        return res.status(201).json({
            success: true,
            message: "Subject created!",
            subject: {
                _id: subject._id,
                name: subject.name,
                code: subject.code,
                units: subject.units
            }
        });
        
    } catch (error) {
        console.error("Create Subject Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Add a new unit to a subject
 * POST /api/v1/chapters/unit
 */
const addUnit = async (req, res) => {
    try {
        const { subjectId, unitNumber, title } = req.body;
        
        if (!subjectId || !unitNumber || !title) {
            return res.status(400).json({ 
                success: false, 
                message: "subjectId, unitNumber, and title are required" 
            });
        }
        
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        
        // Check if unit number already exists
        const existingUnit = subject.units.find(u => u.unitNumber === parseInt(unitNumber));
        if (existingUnit) {
            return res.status(400).json({ 
                success: false, 
                message: `Unit ${unitNumber} already exists` 
            });
        }
        
        // Add new unit
        subject.units.push({
            unitNumber: parseInt(unitNumber),
            title,
            chapters: []
        });
        
        // Sort units by unitNumber
        subject.units.sort((a, b) => a.unitNumber - b.unitNumber);
        
        await subject.save();
        
        return res.status(201).json({
            success: true,
            message: `Unit ${unitNumber} added!`,
            unit: subject.units.find(u => u.unitNumber === parseInt(unitNumber))
        });
        
    } catch (error) {
        console.error("Add Unit Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { generateChaptersFromImage, confirmChapters, getSubjectsForDropdown, createSubject, addUnit };
