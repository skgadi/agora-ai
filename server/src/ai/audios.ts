import dotenv from "dotenv";
dotenv.config();
import { appendToFullTranscript } from "./full-history.js";
import fs from "fs";

import {
  GSK_HISTORY_INPUT_ELEMENT,
  GSK_IN_AUDIO_ELEMENT,
} from "../services/library/types/ai-data-model";

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import { ai } from "./initialization.js";

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
      const speakerTranscript: GSK_HISTORY_INPUT_ELEMENT = {
        participantIdx: elementToProcess.speakerIdx,
        content: transcript,
      };
      appendToFullTranscript(speakerTranscript);
      isProcessing = false;
    }
    // Process the next element in the queue
    prepareAudioHistory();
  }
};

const getTranscriptFromAudio = async (audioLocalUrl: string) => {
  if (!audioLocalUrl) {
    return "";
  }
  // check for the file to exist in the local file system
  const filePath = audioLocalUrl;
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return "";
  }
  const audioFile = await ai().files.upload({
    file: audioLocalUrl,
    config: {
      mimeType: "audio/wav",
    },
  });

  if (!audioFile.uri) {
    return "";
  }
  const response = await ai().models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: createUserContent([
      createPartFromUri(audioFile.uri, audioFile?.mimeType || "audio/wav"),
      "You are the interpreter of the audio. Please transcribe the audio to text. Do not add any additional information. Just transcribe the audio.",
    ]),
  });
  return response?.text || "";
};

export const isAllTasksDone = () => {
  return toAppendQueue.length === 0 && !isProcessing;
};
