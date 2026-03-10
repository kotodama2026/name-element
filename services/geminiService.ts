
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

  // Reverting to the higher-precision Flash model as requested for better diagnosis quality.
  const modelName = "gemini-2.5-flash";

  console.log(`Initializng model: ${modelName}`);

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
    },
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
    【最優先指示】
    あなたは「言霊（ことだま）」の分析官です。
    提供された **Character Data (Source of Truth)** の内容を「絶対的な事実」として扱い、診断文を生成してください。
    AI独自の解釈や、一般的な性質を付け加えることは禁止します。

    Target Name: ${name}
    Primary Element: ${element}

    **Character Data (Source of Truth):**
    ${charDataBlock}
    
    **生成ルール:**
    1. **各文字の分析 (characterAnalyses)**: 
       - 提供されたデータの「Keywords」に含まれる情報を核にして、プロフェッショナルな言霊分析官として「読み応えのある自然な文章」を構築してください。
       - **各項目（nature, talent, caution）は、それぞれ30文字〜60文字程度の具体的な一文化した文章**として生成してください。単語の羅列や短すぎる表現は避けてください。
       - "nature" (性質): Keywordsに含まれる主要な性格や特徴を、その人の本質として述べてください。
       - "talent" (才能): Keywordsに含まれる能力や適性を、どのように活かせるかを含めて述べてください。
       - "caution" (戒め): Keywordsの中の「注意点：」の内容を元に、陥りやすい傾向と対策を述べてください。
       - "luckTip" (開運之導): Keywordsの中の「開運：」の内容を、背中を押すようなアドバイスとして引用または構成してください。
       - 文字（char）は、入力された文字と完全に一致させること。
    2. **要約 (Summary)**:
       - メインエレメント「${element}」に基づき、全体の響きを要約してください。
       - summaryTitle は日本語のみ（例：「${name} 様の言霊分析」）とし、英語を混ぜないでください。
    3. **出力形式**:
       - 必ず有効な JSON オブジェクトのみを返してください。

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
        temperature: 0.4,
        ...({ thinkingConfig: { thinkingBudget: 0 } } as any), // 思考モードをオフにしてJSON出力を安定させる
      }
    });

    const response = await result.response;
    const text = response.text();

    console.log("Response received.");

    try {
      const parsed = JSON.parse(text);
      return parsed as GeminiResponse;
    } catch (parseError) {
      console.error("JSON Parse Error. Raw text:", text);
      // Fallback for cases where Markdown blocks might still be present despite JSON mode
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as GeminiResponse;
      }
      throw parseError;
    }

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
