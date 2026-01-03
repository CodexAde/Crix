
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "AIzaSyCb-2tSPclYpzFKsMX0I6c0b3d9ZD1_U5A",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function testConnection() {
    console.log("Testing connection to:", openai.baseURL);
    
    try {
        console.log("Listing models...");
        const list = await openai.models.list();
        console.log("Models found:", list.data);
    } catch (error) {
        console.error("Error listing models:", error);
    }

    try {
        console.log("\nTrying Generation with 'gemini-1.5-flash'...");
        const completion = await openai.chat.completions.create({
            model: "gemini-1.5-flash",
            messages: [{ role: "user", content: "Hello" }],
        });
        console.log("Success:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Generation failed:", error.message);
    }
}

testConnection();
