
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ElementType, GeminiResponse, CharacterDetail } from '../types';

// Use process.env.API_KEY directly to initialize the client
const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  console.log("Professional Debug: API Key exists:", !!apiKey);

  if (!apiKey) {
    throw new Error("API Key not found in environment (GEMINI_API_KEY or API_KEY)");
  }

  // NOTE: Explicitly setting apiVersion to 'v1' to avoid v1beta 404 issues
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.error("Professional Debug: Failed to initialize GoogleGenerativeAI:", e);
    throw e;
  }
};

export const generateKotodamaReading = async (name: string, element: ElementType, details?: CharacterDetail[]): Promise<GeminiResponse> => {
  const genAI = getClient();

  // The error "models/gemini-1.5-flash is not found for API version v1beta" 
  // suggests we should be extremely careful with the model string.
  const modelName = "gemini-2.5-flash";

  console.log(`Initializng model: ${modelName}`);

  const model = genAI.getGenerativeModel({
    model: modelName,
  });

  let charDataBlock = "";
  if (details) {
    charDataBlock = details.map(d =>
      `Character: "${d.char}"
       - Element: ${d.element}
       - Symbol: ${d.symbol}
       - Image: ${d.image}
       - Keywords: ${d.keyword}`
    ).join("\n\n");
  }

  const prompt = `
    Target Name: ${name}
    Primary Element: ${element}

    You are a "Kotodama" analyzer. Analyze the name based on the provided character data.
    
    **Input Data (Source of Truth):**
    ${charDataBlock}
    
    **Instructions:**
    1. **Per-Character Analysis**: Provide nature, symbol, talent, caution, and luckTip for EACH character.
       - **Important**: If the keywords for a character include "注意点：" or "開運：", prioritize using that specific information for the "caution" and "luckTip" fields.
    2. **Summary**: Provide a summary mentioning the Primary Element (${element}).
       - **Style**: The "summaryTitle" should be only in Japanese (e.g., "〇〇 の言霊分析"). **Do NOT include "(Primary Element: ...)" or any English text in the title.**
    3. **Output**: Return ONLY a valid JSON object.

    **JSON Structure:**
    {
      "characterAnalyses": [
        { "char": "...", "nature": "...", "symbol": "...", "talent": "...", "caution": "...", "luckTip": "..." }
      ],
      "summaryTitle": "...",
      "summaryText": "..."
    }
  `;

  try {
    console.log("Sending request to Gemini...");

    // Explicitly using generateContent with a structure that works across versions
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
      }
    });

    const response = await result.response;
    let text = response.text();

    console.log("Response received.");

    // Extract JSON if model wrapped it in markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    const parsed = JSON.parse(text);
    return parsed as GeminiResponse;

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
