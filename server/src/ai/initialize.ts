//import { GoogleGenAI } from "@google/genai";

require("dotenv").config();
const myGeminiAPIKey = process.env.MY_GEMINI_API_KEY || "default_api_key"; // Replace with your actual API key
//const ai = new GoogleGenAI({apiKey: "GOOGLE_API_KEY"});

export const testMain = () => {
  console.log("testMain");
};
