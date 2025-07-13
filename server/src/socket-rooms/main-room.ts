import { getFullEventData } from "../ai/full-history.js";
import {
  isConnectedToInternet,
  isConnectedToInternetViaHttp,
} from "../services/library/general/utils.js";
import {
  GSK_AI_FULL_EVENT_DATA_TO_CLIENT,
  GSK_AI_TEXT_TO_SPEAK,
  GSK_REQUEST_AI_TO_START_TALKING,
  GSK_REQUEST_AI_TO_STOP_TALKING,
  GSK_SEND_SERVER_INTERNET_CONNECTIVITY,
} from "../services/library/types/data-transfer-protocls.js";
import { GSK_FULL_EVENT_DATA } from "../services/library/types/participants.js";
import { notifyError } from "../services/notifications/index.js";

let io: any;

export const initialize = (inIO: any) => {
  io = inIO;
};

export const joinMainRoom = async (socket: any) => {
  await socket.join("main-room");
  emitFullEventData(getFullEventData());
  emitInternetConnectivity(socket);
  console.log("Socket joined main-room");
};
export const emitAIResponse = (speakerIdx: number, text: string) => {
  const payLoad: GSK_AI_TEXT_TO_SPEAK = {
    type: "GSK_AI_TEXT_TO_SPEAK",
    payload: {
      speakerIdx,
      text,
    },
  };
  //console.log("emitting AI response", payLoad);
  io.to("main-room").emit("main-room-ai-response", payLoad);
};

export const emitFullEventData = (fullEventData: GSK_FULL_EVENT_DATA) => {
  const payLoad: GSK_AI_FULL_EVENT_DATA_TO_CLIENT = {
    fullEventData,
    type: "GSK_AI_FULL_EVENT_DATA_TO_CLIENT",
  };
  io.to("main-room").emit("main-room-full-event-data", payLoad);
};

export const emitAiIsThinking = (speakerIdx: number) => {
  const payLoad: GSK_REQUEST_AI_TO_START_TALKING = {
    type: "GSK_REQUEST_AI_TO_START_TALKING",
    payload: {
      speakerIdx,
    },
  };
  io.to("main-room").emit("main-room-ai-is-thinking", payLoad);
};

export const emitAiStopTalking = (speakerIdx: number) => {
  const payLoad: GSK_REQUEST_AI_TO_STOP_TALKING = {
    type: "GSK_REQUEST_AI_TO_STOP_TALKING",
    payload: {
      speakerIdx,
    },
  };
  io.to("main-room").emit("main-room-ai-stop-talking", payLoad);
};

export const sendErrorToMainRoom = (
  errorTitle: string,
  errorMessage: string
) => {
  notifyError(io, errorMessage, errorTitle);
};

let internetConnectivity = await isConnectedToInternetViaHttp();

setInterval(async () => {
  const isConnected = await isConnectedToInternetViaHttp();
  if (isConnected !== internetConnectivity) {
    internetConnectivity = isConnected;
    emitInternetConnectivity(io);
  }
}, 10000);

export const emitInternetConnectivity = (socket: any) => {
  const payload: GSK_SEND_SERVER_INTERNET_CONNECTIVITY = {
    type: "GSK_SEND_SERVER_INTERNET_CONNECTIVITY",
    payload: {
      isConnected: internetConnectivity,
    },
  };
  if (socket) {
    socket.emit("socket-internet-connectivity", payload);
  } else {
    io.to("main-room").emit("socket-internet-connectivity", payload);
  }
};
