import { GSK_CHAT_MESSAGE } from "../services/library/types/ai-data-model.js";
import { sendChatHistory } from "../socket-rooms/main-room.js";

const chatHistory: GSK_CHAT_MESSAGE[] = [];

const addAUserChatMessage = (chatMessage: string) => {
  const newMessage: GSK_CHAT_MESSAGE = {
    who: "user",
    content: chatMessage,
    timestamp: Date.now(),
  };
  chatHistory.push(newMessage);
};

const addAnAIChatMessage = (chatMessage: string) => {
  const newMessage: GSK_CHAT_MESSAGE = {
    who: "ai",
    content: chatMessage,
    timestamp: Date.now(),
  };
  chatHistory.push(newMessage);
};

export const addHistoryUserAndAIChatMessage = (
  userChatMessage: string,
  aiChatMessage: string
) => {
  addAUserChatMessage(userChatMessage);
  addAnAIChatMessage(aiChatMessage);
  sendChatHistory(null); // Send to all clients
};

export const prepareChatHistoryForAI = () => {
  return chatHistory.map((message) => ({
    role: message.who === "user" ? "user" : "model",
    parts: [
      {
        text: message.content,
      },
    ],
  }));
};

export const getChatHistory = () => {
  return chatHistory;
};

export const resetChatHistory = () => {
  chatHistory.length = 0; // Clear the existing chat history
  sendChatHistory(null); // Notify clients that the chat history has been reset
};
