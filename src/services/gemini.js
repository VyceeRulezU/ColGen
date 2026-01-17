import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

export const initializeGemini = (apiKey) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const generateThemeFromPrompt = async (prompt, apiKey) => {
  if (!genAI && apiKey) initializeGemini(apiKey);
  if (!genAI && apiKey) initializeGemini(apiKey);
  
  // If no API key, use fallback immediately
  if (!genAI) {
      console.warn("No API Key found, using heuristic fallback.");
      const { generateHeuristicTheme } = await import("../utils/heuristic");
      return generateHeuristicTheme(prompt);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const systemPrompt = `
    You are a color theory expert. Generate a color palette based on the user's description.
    Return ONLY a JSON object with the following keys:
    - primary (hex code)
    - secondary (hex code)
    - accent (hex code)
    - surface (hex code, for backgrounds)
    - explanation (short sentence why these colors fit)
    
    Ensure high contrast and modern aesthetics.
  `;

  try {
    const result = await model.generateContent(systemPrompt + " Description: " + prompt);
    const response = await result.response;
    let text = response.text();
    console.log("Gemini Raw Response:", text); // Debug log

    // Clean markdown code blocks if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Find the first opening brace and last closing brace to extract JSON
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
        text = text.substring(firstBrace, lastBrace + 1);
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.warn("Gemini API failed, switching to fallback:", error);
    
    // Dynamic import to avoid circular defaults if possible, or just import at top if clean.
    // Since we are in a module, let's use the fallback utility.
    // We need to import it at the top of the file, but for this edit, I'll return the fallback logic directly 
    // or assume we allow imports. Let's add the import to the top first.
    
    // Just re-throw a specific error that the UI can catch, OR handle it here?
    // User wants "alternative work through".
    // Let's return the fallback object directly from here so the UI doesn't know the difference.
    
    const { generateHeuristicTheme } = await import("../utils/heuristic");
    return generateHeuristicTheme(prompt);
  }
};

export const chatWithGemini = async (history, message, apiKey) => {
    if (!genAI && apiKey) initializeGemini(apiKey);
    if (!genAI) throw new Error("API Key required");
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
        history: history.map(h => ({
            role: h.role,
            parts: [{ text: h.content }]
        }))
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
}
