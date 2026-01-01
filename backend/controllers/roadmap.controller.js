import { asyncHandler } from "../utils/Constructors/asyncHandler.js";
import { ApiError } from "../utils/Constructors/ApiError.js";
import { ApiResponse } from "../utils/Constructors/ApiResponse.js";
import { generateTextResponse } from "../utils/aiUtilities/textResponse.js";
import * as roadmapService from "../services/roadmap.service.js";
import { Subject } from "../models/syllabus.model.js";

const generateRoadmapAI = asyncHandler(async (req, res) => {
  let { subject, duration, selectedChapters, selectedTopics } = req.body;

  if (!subject) {
    throw new ApiError(400, "Subject is required");
  }

  const actualDuration = Math.min(parseInt(duration) || 30, 30);

  const existingSubject = await Subject.findOne({ 
    $or: [
      { name: { $regex: new RegExp(subject, "i") } },
      { code: { $regex: new RegExp(subject, "i") } }
    ]
  });

  if (!existingSubject) {
    throw new ApiError(404, `Syllabus for "${subject}" not found.`);
  }

  // Filter syllabus context if specific chapters or topics are selected
  let filteredUnits = existingSubject.units;
  if (selectedChapters?.length > 0 || selectedTopics?.length > 0) {
    filteredUnits = existingSubject.units.map(unit => {
      const filteredChapters = unit.chapters.filter(chapter => {
        // If chapter itself is selected, keep it
        if (selectedChapters?.includes(chapter._id.toString())) return true;
        // If any of its topics are selected, keep the chapter
        return chapter.topics.some(topic => selectedTopics?.includes(topic._id.toString()));
      }).map(chapter => {
        // If chapter is selected but topics aren't specifically filtered, keep all topics
        // If topics are specifically selected, filter them within the chapter
        if (selectedTopics?.length > 0) {
          const filteredTopics = chapter.topics.filter(topic => selectedTopics.includes(topic._id.toString()));
          return { ...chapter, topics: filteredTopics };
        }
        return chapter;
      });
      return { ...unit, chapters: filteredChapters };
    }).filter(unit => unit.chapters.length > 0);
  }

  const prompt = `
    You are an Elite Academic Strategist. Generate a SOPHISTICATED study roadmap for: "${existingSubject.name}".
    Duration: ${actualDuration} days.
    
    ${selectedChapters?.length > 0 || selectedTopics?.length > 0 ? "IMPORTANT: The student has selected SPECIFIC chapters/topics. ONLY include these in the roadmap." : "FULL SYLLABUS CONTEXT:"}
    
    ${filteredUnits.map(u => `
    UNIT ${u.unitNumber}: ${u.title}
    Chapters:
    ${u.chapters.map(c => `
      - CHAPTER: ${c.title}
        Topics: ${c.topics.map(t => t.title).join(", ")}
    `).join("")}
    `).join("\n")}

    CRITICAL RULES:
    1. ARRANGE ALL topics from the provided syllabus above into a logical study plan.
    2. The plan MUST be achievable within ${actualDuration} days.
    3. Each day should have a title (like a chapter title) and multiple topics to cover.
    4. Maximum duration is 30 days.
    5. The response must be ONLY a RAW JSON object. NO markdown code blocks.
    
    JSON STRUCTURE (MATCH THIS EXACTLY):
    {
      "name": "${existingSubject.name} - ${actualDuration} Day Roadmap",
      "description": "Strategy description",
      "days": [
        {
          "dayNumber": 1,
          "title": "Day 1 Title (like a chapter name)",
          "topics": [
            {
              "title": "Topic 1 Title",
              "description": "What to study and key points",
              "orderIndex": 0
            },
            {
              "title": "Topic 2 Title",
              "description": "What to study and key points",
              "orderIndex": 1
            }
          ]
        }
      ]
    }
    `;

  const aiResponse = await generateTextResponse(prompt, "tngtech/deepseek-r1t2-chimera:free");
  
  let roadmapData;
  try {
    let jsonString = aiResponse;
    const firstBrace = aiResponse.indexOf('{');
    const lastBrace = aiResponse.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonString = aiResponse.substring(firstBrace, lastBrace + 1);
    }

    jsonString = jsonString
      .replace(/\`\`\`json/g, '')
      .replace(/\`\`\`/g, '')
      .trim();

    try {
      roadmapData = JSON.parse(jsonString);
    } catch (parseError) {
      const fixedJson = jsonString
        .replace(/,\s*([\]}])/g, '$1')
        .replace(/\n\s*\n/g, '\n');
      
      roadmapData = JSON.parse(fixedJson);
    }
  } catch (error) {
    console.error("AI JSON Parse Error:", error);
    console.error("Original AI Response:", aiResponse);
    throw new ApiError(500, "Failed to generate roadmap. Please try again.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { 
      ...roadmapData, 
      subject: existingSubject.name,
      subjectId: existingSubject._id,
      duration: actualDuration,
      branch: existingSubject.branch,
      year: existingSubject.year
    }, "Roadmap generated successfully"));
});

const saveRoadmap = asyncHandler(async (req, res) => {
  const { subject, name, description, duration, days, subjectId, branch, year } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!subject || !name || !days) {
    throw new ApiError(400, "Missing required fields");
  }

  const roadmap = await roadmapService.createRoadmap({
    user: userId,
    subject,
    subjectId,
    name,
    description,
    duration,
    days,
    branch,
    year
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

const getRoadmapById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const roadmap = await roadmapService.findRoadmapById(id);

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { roadmap }, "Roadmap fetched successfully"));
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

export { generateRoadmapAI, saveRoadmap, getMyRoadmaps, getRoadmapById, deleteRoadmap };
