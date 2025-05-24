import {
  GSK_FULL_AUDIO_ELEMENT,
  GSK_IN_AUDIO_ELEMENT,
} from "../services/library/types/ai-data-model";

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

export const audioHistory: GSK_FULL_AUDIO_ELEMENT[] = [];

export const toAppendQueue: GSK_IN_AUDIO_ELEMENT[] = [];
export let isProcessing = false;

export const addAudioToHistory = (audioElement: GSK_IN_AUDIO_ELEMENT) => {
  toAppendQueue.push(audioElement);
  prepareAudioHistory();
};

export const prepareAudioHistory = async () => {
  if (toAppendQueue.length > 0) {
    const elementToProcess = toAppendQueue.shift();
    if (elementToProcess) {
      isProcessing = true;
      const { localUrl } = elementToProcess;
      // Check if the localUrl is a valid URL
      const transcript = await getTranscriptFromAudio(localUrl);
      const fullAudioElement: GSK_FULL_AUDIO_ELEMENT = {
        ...elementToProcess,
        transcript,
      };
      audioHistory.push(fullAudioElement);
      isProcessing = false;
    }
    // Process the next element in the queue
    prepareAudioHistory();
  }
};

import dotenv from "dotenv";
dotenv.config();

const myGeminiAPIKey = process.env.MY_GEMINI_API_KEY || "default_api_key"; // Replace with your actual API key
const ai = new GoogleGenAI({ apiKey: myGeminiAPIKey });

const getTranscriptFromAudio = async (audioLocalUrl: string) => {
  if (!audioLocalUrl) {
    return "";
  }
  // check for the file to exist in the local file system
  const fs = require("fs");
  const filePath = audioLocalUrl;
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return "";
  }
  const audioFile = await ai.files.upload({
    file: audioLocalUrl,
    config: {
      mimeType: "audio/wav",
    },
  });

  if (!audioFile.uri) {
    return "";
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: createUserContent([
      createPartFromUri(audioFile.uri, audioFile?.mimeType || "audio/wav"),
      "Transcribe the audio",
    ]),
  });
  return response?.text || "";
};

export const getAudioHistory = () => {
  return audioHistory;
};
export const clearAudioHistory = () => {
  audioHistory.length = 0;
  toAppendQueue.length = 0;
};
export const isAllTasksDone = () => {
  return toAppendQueue.length === 0 && !isProcessing;
};
