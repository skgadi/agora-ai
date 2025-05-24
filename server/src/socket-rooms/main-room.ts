import { getFullEventData } from "../ai/full-history.js";
import {
  GSK_AI_FULL_EVENT_DATA_TO_CLIENT,
  GSK_AI_TEXT_TO_SPEAK,
} from "../services/library/types/data-transfer-protocls.js";
import { GSK_FULL_EVENT_DATA } from "../services/library/types/participants.js";

let io: any;

export const initialize = (inIO: any) => {
  io = inIO;
};

export const joinMainRoom = async (socket: any) => {
  await socket.join("main-room");
  emitFullEventData(getFullEventData());
};
export const emitAIResponse = (speakerIdx: number, text: string) => {
  const payLoad: GSK_AI_TEXT_TO_SPEAK = {
    type: "GSK_AI_TEXT_TO_SPEAK",
    payload: {
      speakerIdx,
      text,
    },
  };
  io.to("main-room").emit("main-room-ai-response", payLoad);
};

export const emitFullEventData = (fullEventData: GSK_FULL_EVENT_DATA) => {
  const payLoad: GSK_AI_FULL_EVENT_DATA_TO_CLIENT = {
    fullEventData,
    type: "GSK_AI_FULL_EVENT_DATA_TO_CLIENT",
  };
  io.to("main-room").emit("main-room-full-event-data", payLoad);
};
