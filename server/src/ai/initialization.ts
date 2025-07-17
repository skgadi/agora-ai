import { GoogleGenAI, Model } from "@google/genai";

import dotenv from "dotenv";
import { GSK_AI_MODEL } from "../services/library/types/ai-data-model.js";
dotenv.config();

const aiHandler = {
  myGeminiAPIKey: process.env.MY_PAI_GEMINI_API_KEY || "default_api_key", // Replace with your actual API key
  ai: new GoogleGenAI({
    apiKey: process.env.MY_PAI_GEMINI_API_KEY || "default_api_key", // Replace with your actual API key
  }),
};

const listOfModelsToUse = [] as Array<GSK_AI_MODEL>;

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

const getListOfModels = async () => {
  try {
    const models = await aiHandler.ai.models.list();
    const allModels = [] as Array<Model>;
    for await (const model of models) {
      allModels.push(model);
    }
    const usefulModels = [] as Array<Model>;
    usefulModels.push(
      ...allModels.filter((model) =>
        model?.supportedActions?.includes("generateContent")
      )
    );
    listOfModelsToUse.length = 0; // Clear the existing list
    usefulModels.forEach((model) => {
      if (model.name && model.displayName) {
        listOfModelsToUse.push({
          modelId: model.name,
          modelName: model.displayName,
        });
      }
    });
  } catch (error) {
    console.error("Error fetching models:", error);
  }
};
getListOfModels();

const selectedModel: GSK_AI_MODEL = {
  modelId: "models/gemini-2.0-flash",
  modelName: "Gemini 2.0 Flash",
};

export const getSelectedModel = () => {
  return selectedModel;
};

export const getListOfUsefulModels = () => {
  return listOfModelsToUse;
};

export const setSelectedModel = (model: GSK_AI_MODEL) => {
  if (!model || !model.modelId || !model.modelName) {
    throw new Error("Invalid model provided");
  }
  selectedModel.modelId = model.modelId;
  selectedModel.modelName = model.modelName;
};
