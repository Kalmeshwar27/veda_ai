import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment");
}

export const ai = new GoogleGenAI({ apiKey });

export const GEMINI_MODEL = "gemini-3.6-flash";

export function fileToPart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}