import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { RefinementStyle, RefinementResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function transcribeAndRefine(
  audioBlob: Blob,
  style: RefinementStyle
): Promise<RefinementResult> {
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve) => {
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.readAsDataURL(audioBlob);
  });

  const base64Data = await base64Promise;

  const stylePrompts: Record<RefinementStyle, string> = {
    professional: "Refine this text into a clear, professional, and readable format suitable for business communication.",
    simple: "Simplify this text to make it easy to understand while keeping the core message intact.",
    formal: "Convert this text into a formal tone, suitable for official documents or academic contexts.",
    friendly: "Make this text sound warm, friendly, and conversational while maintaining clarity.",
    "client-ready": "Polish this text specifically for a client reply (e.g., Upwork, Fiverr). It should be persuasive, professional, and concise."
  };

  const prompt = `
    You are an expert multilingual transcription and content refinement assistant.
    The user has provided an audio recording. 
    
    TASK:
    1. Transcribe the audio accurately. The audio might be in Urdu, English, Roman Urdu, Hindi, or a mix.
    2. Detect the primary language used.
    3. Refine the transcribed text according to this style: "${style}".
    4. ${stylePrompts[style]}

    OUTPUT FORMAT:
    Return ONLY a JSON object with the following structure:
    {
      "originalText": "The raw transcription of the audio",
      "refinedText": "The polished and refined version of the text",
      "detectedLanguage": "The name of the detected language"
    }
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: audioBlob.type,
              data: base64Data,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
    },
  });

  try {
    const result = JSON.parse(response.text || "{}");
    return {
      originalText: result.originalText || "",
      refinedText: result.refinedText || "",
      detectedLanguage: result.detectedLanguage || "Unknown",
    };
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to process the audio. Please try again.");
  }
}
