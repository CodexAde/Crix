import OpenAI from 'openai';

let openai = null;
const getOpenAI = () => {
    if (!openai) {
        openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "Crix AI Tutor"
            }
        });
    }
    return openai;
};

const generateTextResponse = async (prompt, model = "tngtech/deepseek-r1t2-chimera:free") => {
  try {
    const response = await getOpenAI().chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

export { generateTextResponse };
