import { asyncHandler } from "../utils/Constructors/asyncHandler.js";
import { ApiError } from "../utils/Constructors/ApiError.js";
import { ApiResponse } from "../utils/Constructors/ApiResponse.js";
import { generateTextResponse } from "../utils/aiUtilities/textResponse.js";
import * as roadmapService from "../services/roadmap.service.js";
import { Subject } from "../models/syllabus.model.js";

const generateRoadmapAI = asyncHandler(async (req, res) => {
  let { subject, duration, targetExam } = req.body;

  if (!subject) {
    throw new ApiError(400, "Subject is required");
  }

  // Cap duration at 30 days
  const actualDuration = Math.min(parseInt(duration) || 30, 30);

  // 1. Fetch Syllabus Context
  const existingSubject = await Subject.findOne({ 
    $or: [
      { name: { $regex: new RegExp(subject, "i") } },
      { code: { $regex: new RegExp(subject, "i") } }
    ]
  });

  let syllabusContext = "";
  if (existingSubject) {
    syllabusContext = `
    EXISTING SYLLABUS DATA (USE ONLY THIS):
    Subject: ${existingSubject.name}
    Units:
    ${existingSubject.units.map(u => `
      Unit ${u.unitNumber}: ${u.title}
      Chapters: ${u.chapters.map(c => `
        - ${c.title}: ${c.topics.map(t => t.title).join(", ")}
      `).join("")}
    `).join("")}
    `;
  } else {
    // If subject doesn't exist, we might want to throw an error or handle it.
    // The user said "jo jo syllabus available hai na use hi touch krke leke aana"
    throw new ApiError(404, `Syllabus for "${subject}" not found. Please try subjects like Engineering Mechanics, etc.`);
  }

  const prompt = `
    You are an Elite Academic Strategist. Generate a SOPHISTICATED and DETAILED study roadmap for: "${existingSubject.name}".
    Duration: ${actualDuration} days.
    
    FULL SYLLABUS CONTEXT:
    ${existingSubject.units.map(u => `
    UNIT ${u.unitNumber}: ${u.title}
    Chapters:
    ${u.chapters.map(c => `
      - CHAPTER: ${c.title}
        Topics: ${c.topics.map(t => t.title).join(", ")}
        Topic Descriptions: ${c.topics.map(t => `${t.title}: ${t.description}`).join("; ")}
    `).join("")}
    `).join("\n")}

    CRITICAL RULES:
    1. ARRANGE ALL topics from the provided syllabus above into a logical study plan.
    2. The plan MUST be achievable within ${actualDuration} days.
    3. The roadmap must be high-complexity, including specific topic breakdowns, daily goals, and revision milestones.
    4. Maximum duration is 30 days.
    5. The response must be ONLY a RAW JSON object. DO NOT include markdown code blocks.
    
    JSON STRUCTURE:
    {
      "title": "Roadmap Title",
      "description": "Sophisticated strategy description",
      "steps": [
        {
          "day": 1,
          "topic": "Specific Chapter/Topic from Syllabus",
          "description": "Detailed explanation of what to cover, its complexity, and focus areas."
        }
      ]
    }
    `;

  const aiResponse = await generateTextResponse(prompt, "tngtech/deepseek-r1t2-chimera:free");
  
  let roadmapData;
  try {
    // 1. Try to extract JSON from the response (sometimes AI adds text before/after)
    let jsonString = aiResponse;
    const firstBrace = aiResponse.indexOf('{');
    const lastBrace = aiResponse.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonString = aiResponse.substring(firstBrace, lastBrace + 1);
    }

    // 2. Clean common AI artifacts if they still exist
    jsonString = jsonString
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      roadmapData = JSON.parse(jsonString);
    } catch (parseError) {
      // 3. Last ditch effort: Try to fix trailing commas or minor syntax issues
      // This is a basic fix for trailing commas in arrays/objects
      const fixedJson = jsonString
        .replace(/,\s*([\]}])/g, '$1') // Remove trailing commas
        .replace(/\n\s*\n/g, '\n'); // Remove extra empty lines
      
      roadmapData = JSON.parse(fixedJson);
    }
  } catch (error) {
    console.error("AI JSON Parse Error:", error);
    console.error("Original AI Response:", aiResponse);
    throw new ApiError(500, "Failed to generate a valid roadmap strategy. Please try again with a shorter duration.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { ...roadmapData, subjectId: existingSubject._id }, "Sophisticated roadmap generated successfully"));
});

const saveRoadmap = asyncHandler(async (req, res) => {
  const { subject, title, description, duration, steps, subjectId } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!subject || !title || !steps) {
    throw new ApiError(400, "Missing required fields");
  }

  const roadmap = await roadmapService.createRoadmap({
    user: userId,
    subject,
    subjectId,
    title,
    description,
    duration,
    steps,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, roadmap, "Roadmap saved successfully"));
});

const getMyRoadmaps = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const roadmaps = await roadmapService.findRoadmapsByUser(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, roadmaps, "Roadmaps fetched successfully"));
});

const deleteRoadmap = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const roadmap = await roadmapService.deleteRoadmapById(id, userId);

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Roadmap deleted successfully"));
});

export { generateRoadmapAI, saveRoadmap, getMyRoadmaps, deleteRoadmap };
