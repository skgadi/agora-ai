import { ai } from "./initialization.js";

import {
  appendToFullTranscript,
  getPromptForAI,
  getSystemPrompt,
} from "./full-history.js";
import { isAllTasksDone } from "./audios.js";
import { emitAIResponse } from "../socket-rooms/main-room.js";

const queueToGetResponse: number[] = []; // Queue to hold participant indices for which we need to get responses
let isProcessing = false; // Flag to indicate if we are currently processing a response
const processQueue = async () => {
  // Check if there is any processing in progress
  const isAudioProcessComplete = isAllTasksDone();
  if (!isAudioProcessComplete) {
    // run the queue after 1 second
    setTimeout(() => {
      processQueue();
    }, 1000);
    return; // If processing is in progress, exit the function
  }

  if (queueToGetResponse.length > 0) {
    const participantIdx = queueToGetResponse.shift(); // Get the next participant index from the queue
    if (participantIdx !== undefined) {
      isProcessing = true; // Set the processing flag to true
      await getResponseFromAI(participantIdx); // Call the function to get the response from AI
      isProcessing = false; // Reset the processing flag
    }
    // Process the next element in the queue
    processQueue();
  }
};
export const addToResponseQueue = (participantIdx: number) => {
  queueToGetResponse.push(participantIdx); // Add the participant index to the queue
  if (!isProcessing) {
    processQueue(); // If not already processing, start processing the queue
  }
};

export const getResponseFromAI = async (participantIdx: number) => {
  try {
    const systemInstruction = getSystemPrompt(participantIdx);
    const prompt = getPromptForAI();
    const response = await ai().models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    const recevedResponse = response?.text;
    appendToFullTranscript({
      participantIdx,
      content: recevedResponse || "No response",
    });
    if (recevedResponse) {
      emitAIResponse(participantIdx, response.text); // Emit the AI response to the main room
    }
  } catch (error) {
    appendToFullTranscript({
      participantIdx,
      content: "Unable to record the response",
    });
    console.error("Error generating response from AI:", error);
  }
};
