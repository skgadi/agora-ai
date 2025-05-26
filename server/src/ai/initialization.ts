import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
dotenv.config();

const aiHandler = {
  myGeminiAPIKey: process.env.MY_GEMINI_API_KEY || "default_api_key", // Replace with your actual API key
  ai: new GoogleGenAI({
    apiKey: process.env.MY_GEMINI_API_KEY || "default_api_key", // Replace with your actual API key
  }),
};
let myGeminiAPIKey = process.env.MY_GEMINI_API_KEY || "default_api_key"; // Replace with your actual API key

export const setMyGeminiAPIKey = (apiKey: string) => {
  if (!apiKey || typeof apiKey !== "string") {
    throw new Error("Invalid API key provided");
  }
  aiHandler.myGeminiAPIKey = apiKey;
  aiHandler.ai = new GoogleGenAI({ apiKey }); // Reinitialize the AI handler with the new API key
};

export const ai = () => {
  if (!aiHandler.ai) {
    throw new Error(
      "AI handler is not initialized. Please set the API key first."
    );
  }
  return aiHandler.ai;
};
