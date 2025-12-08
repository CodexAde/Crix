import OpenAI from "openai";
import { User } from "../models/user.model.js";
import { Subject } from "../models/syllabus.model.js";

// Initialize OpenAI client with Gemini base URL
const openai = new OpenAI({
    apiKey: "AIzaSyCb-2tSPclYpzFKsMX0I6c0b3d9ZD1_U5A",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const streamChat = async (req, res) => {
    try {
        const { topicId, message, history = [] } = req.body;
        const userId = req.user._id;

        // 1. Fetch Context
        const user = await User.findById(userId);
        
        // Find topic details
        const subjects = await Subject.find({"units.chapters.topics._id": topicId});
        let topicContext = "General Engineering Topic";
        if (subjects.length > 0) {
            const subject = subjects[0];
            let foundTopic = null;
            subject.units.forEach(u => {
                u.chapters.forEach(c => {
                    const t = c.topics.find(t => t._id.toString() === topicId);
                    if(t) foundTopic = t;
                })
            });
            if(foundTopic) {
                topicContext = `Topic: ${foundTopic.title}. Description: ${foundTopic.description}. Subject: ${subject.name}`;
            }
        }

        // 2. Construct System Prompt
        let systemPrompt = `You are an expert personalized AI tutor for B.Tech 1st year students.
        
        CONTEXT:
        ${topicContext}

        USER PERSONA (Follow this style STRICTLY):
        ${JSON.stringify(user.personaProfile || {})}
        
        INSTRUCTIONS:
        - Teach concepts clearly from basics.
        - Use the user's preferred language style (e.g. Hindi-English mix if requested).
        - Be encouraging but focused.
        - If asked for MCQs, provide 5 with answers.
        - If asked for numericals, provide step-by-step solutions.
        `;

        // 3. Prepare Messages for OpenAI format
        // history expects [{role: 'user'|'assistant', content: 'text'}]
        const messages = [
            { role: "system", content: systemPrompt },
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: "user", content: message }
        ];

        // 4. Call API using OpenAI style
        const completion = await openai.chat.completions.create({
            model: "gemini-flash-latest",
            messages: messages,
        });

        const text = completion.choices[0].message.content;

        res.json({ success: true, message: text });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ success: false, error: "Something went wrong with the AI." });
    }
};
