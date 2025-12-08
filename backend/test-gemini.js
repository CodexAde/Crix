
import { GoogleGenerativeAI } from "@google/generative-ai";

// Using the key currently in ai.controller.js
const genAI = new GoogleGenerativeAI("AIzaSyCb-2tSPclYpzFKsMX0I6c0b3d9ZD1_U5A");

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // There isn't a direct "listModels" method on the client instance in valid public documentation for the simple API key flow,
    // but typically we test by trying to generate content or handling the specific error.
    // However, the error message 'Call ListModels to see...' suggests we might be missing access.
    
    // Let's try a simple generation to see the exact error or success
    console.log("Attempting to generate content with gemini-1.5-flash...");
    const result = await model.generateContent("Hello");
    console.log("Success! Response:", result.response.text());
  } catch (error) {
    console.error("Error details:", error);
    // Determine if it's a key issue or model issue
    if (error.message.includes("API key not valid")) {
        console.log("\n--- DIAGNOSIS: API KEY IS INVALID ---");
    } else if (error.message.includes("404")) {
        console.log("\n--- DIAGNOSIS: MODEL NOT FOUND (Key might be valid but scoped wrong, or API not enabled) ---");
    }
  }
}

listModels();
