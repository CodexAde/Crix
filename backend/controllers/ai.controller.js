import OpenAI from "openai";
import { User } from "../models/user.model.js";
import { Subject } from "../models/syllabus.model.js";
import { Chat } from "../models/chat.model.js";

// Initialize OpenAI client with Gemini base URL
const openai = new OpenAI({
    apiKey: "AIzaSyCb-2tSPclYpzFKsMX0I6c0b3d9ZD1_U5A",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Get chat history for a topic
const getChatHistory = async (req, res) => {
    try {
        const { topicId } = req.params;
        const userId = req.user._id;

        const chat = await Chat.findOne({ userId, topicId });
        
        if (!chat) {
            return res.json({ success: true, messages: [] });
        }

        res.json({ success: true, messages: chat.messages });
    } catch (error) {
        console.error("Get Chat History Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch chat history." });
    }
};

const streamChat = async (req, res) => {
    try {
        const { topicId, message, history = [] } = req.body;
        const userId = req.user._id;

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

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

        // 2. Construct System Prompt (Updated as per user request)
        let systemPrompt = `You are an AI tutor whose responses are streamed live into a chat UI.

VERY IMPORTANT OUTPUT RULES (do not ignore):
1. Your text will be injected into the DOM word-by-word (streaming).
2. Write naturally for a typing experience, not for static reading.
3. Use short sentences.
4. Avoid long paragraphs.
5. Insert natural pauses by breaking content into small chunks.
6. Prefer new lines instead of long blocks of text.
7. Reveal ideas step-by-step, not all at once.

FORMATTING RULES:
- Use Markdown for structure.
- Use:
  - ### for section headings
  - **bold** for important keywords
  - *italic* for emphasis
  - --- for visual separators
- When using formulas, wrap them in:
  $$ formula here $$

LANGUAGE & TONE:
- Speak in Hindi written in English alphabets.
- Be very casual and friendly.
- Use words like "bhai", "dekh", "simple bolu to", "samajh aaya?".
- Use emojis occasionally (😎 ✅ 💡 🔥), but keep them light.

TEACHING STYLE:
- Start from absolute basics.
- Assume the learner is a B.Tech 1st year student.
- Explain intuitively first, then definitions.
- Never dump full theory in one go.
- Context: ${topicContext}
- User Persona: ${JSON.stringify(user.personaProfile || {})}
`;

        // 3. Prepare Messages
        const messages = [
            { role: "system", content: systemPrompt },
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: "user", content: message }
        ];

        // 4. Call API with Streaming
        const stream = await openai.chat.completions.create({
            model: "gemini-flash-latest",
            messages: messages,
            stream: true,
        });

        let fullResponse = "";

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                fullResponse += content;
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
        }

        // 5. Save messages to MongoDB
        await Chat.findOneAndUpdate(
            { userId, topicId },
            {
                $push: {
                    messages: {
                        $each: [
                            { role: 'user', content: message },
                            { role: 'assistant', content: fullResponse }
                        ]
                    }
                }
            },
            { upsert: true, new: true }
        );

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error("AI Error:", error);
        // If headers weren't sent, send JSON error, else write event
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: "Something went wrong with the AI." });
        } else {
            res.write(`data: ${JSON.stringify({ error: "Something went wrong." })}\n\n`);
            res.end();
        }
    }
};

export { streamChat, getChatHistory };
