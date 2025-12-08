import OpenAI from "openai";
import { User } from "../models/user.model.js";
import { Subject } from "../models/syllabus.model.js";
import { Chat } from "../models/chat.model.js";

// Initialize OpenAI client with Gemini base URL
const openai = new OpenAI({
    apiKey: "AIzaSyDs5R_mTS1-ZthFNFTB3UJrvykGNktBE48",
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

CRITICAL FORMATTING RULES (MUST FOLLOW):
1. ALWAYS add a blank line between paragraphs.
2. ALWAYS add a blank line BEFORE a heading.
3. ALWAYS add a blank line AFTER a heading.
4. ALWAYS add a blank line BEFORE and AFTER horizontal rules (---).
5. ALWAYS add a blank line BEFORE and AFTER code blocks.
6. ALWAYS add a blank line BEFORE and AFTER lists.
7. Keep paragraphs SHORT - maximum 2-3 sentences per paragraph.
8. After every 2-3 short paragraphs, add a visual separator (---) with blank lines around it.

HEADING RULES:
- Use ## for main section headings (with blank line before and after)
- Use ### for sub-headings (with blank line before and after)
- Use **bold text** for important terms within text
- Headings should be clear and descriptive

OUTPUT STRUCTURE EXAMPLE:
## Main Topic

First short paragraph explaining the core concept.

Second paragraph with more details.

---

### Sub Section

Point by point explanation here.

Another paragraph with spacing.

---

MARKDOWN USAGE:
- Use **bold** for important keywords
- Use *italic* for emphasis
- Use \`code\` for technical terms inline
- Use --- with blank lines around it for visual breaks
- For formulas use: $$ formula $$
- For lists, add blank line before and after the list

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
- Break complex topics into small, digestible chunks.
- Context: ${topicContext}
- User Persona: ${JSON.stringify(user.personaProfile || {})}

REMEMBER: Proper spacing makes content readable. Always add blank lines between sections!
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
