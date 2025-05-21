import dotenv from "dotenv";
dotenv.config();

const myGeminiApi = process.env.MY_GEMINI_API_KEY || "default_api_key"; // Replace with your actual API key

export const testMain = async () => {
  console.log("myGeminiApi", myGeminiApi);
};
