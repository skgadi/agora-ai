import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
dotenv.config();

const myGeminiAPIKey = process.env.MY_GEMINI_API_KEY || "default_api_key"; // Replace with your actual API key
const ai = new GoogleGenAI({ apiKey: myGeminiAPIKey });

export const testMain = async () => {
  console.log("testMain");
  const response = await ai.models.generateContentStream({
    model: "gemini-2.0-flash-001",
    contents: "Write a 100-word poem.",
  });
  for await (const chunk of response) {
    console.log(chunk.text);
  }
};
