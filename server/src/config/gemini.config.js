import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-3.5-flash";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateContent = async (prompt) => {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

      return response.text;

      
    } catch (error) {
      console.error(
        `Gemini API Error (Attempt ${attempt}/${maxRetries}):`,
        error.message
      );

      const isTemporaryError =
        error.message?.includes("503") ||
        error.message?.includes("UNAVAILABLE");

      if (!isTemporaryError || attempt === maxRetries) {
        throw new Error(`Gemini API failed: ${error.message}`);
      }

      // Wait 2s, then 4s, then 6s
      const delay = attempt * 2000;

      console.log(`Gemini temporarily unavailable. Retrying in ${delay / 1000}s...`);

      await sleep(delay);
    }
  }
};

export { generateContent };