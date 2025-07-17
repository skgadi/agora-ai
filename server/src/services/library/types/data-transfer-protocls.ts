import type {
  GSK_AI_MODEL,
  GSK_CHAT_MESSAGE,
  GSK_HISTORY_ELEMENT,
} from "./ai-data-model.js";
import type { GSK_FULL_EVENT_DATA } from "./participants.js";

export interface GSK_SETTINGS_TO_INIT_AI {
  type: "GSK_SETTINGS_TO_INIT_AI";
  fullEventData: GSK_FULL_EVENT_DATA;
}

export interface GSK_VOICE_INPUT_TO_SERVER {
  type: "GSK_VOICE_INPUT_TO_SERVER";
  payload: {
    voiceBlob: Blob;
    speakerIdx: number;
  };
}

/**
 *
 * Not implemented yet
 */
export interface GSK_REQUST_AI_TO_GENERATE {
  type: "GSK_REQUST_AI_TO_GENERATE";
  payload: {
    speakerIdx: number;
  };
}

export interface GSK_REQUEST_AI_TO_STOP_TALKING {
  type: "GSK_REQUEST_AI_TO_STOP_TALKING";
  payload: {
    speakerIdx: number;
  };
}
export interface GSK_REQUEST_AI_TO_START_TALKING {
  type: "GSK_REQUEST_AI_TO_START_TALKING";
  payload: {
    speakerIdx: number;
  };
}

export interface GSK_AI_TEXT_TO_SPEAK {
  type: "GSK_AI_TEXT_TO_SPEAK";
  payload: GSK_AI_TEXT_TO_SPEAK_ELEMENT;
}

export interface GSK_AI_TEXT_TO_SPEAK_ELEMENT {
  speakerIdx: number;
  text: string;
}

export interface GSK_AI_FULL_EVENT_DATA_TO_CLIENT {
  type: "GSK_AI_FULL_EVENT_DATA_TO_CLIENT";
  fullEventData: GSK_FULL_EVENT_DATA;
}

export interface GSK_AI_HISTORY_TO_CLIENT {
  type: "GSK_AI_HISTORY_TO_CLIENT";
  history: GSK_HISTORY_ELEMENT[];
}

export interface GSK_HUMAN_READABLE_REPORT {
  type: "GSK_HUMAN_READABLE_REPORT";
  report: string;
}

export interface GSK_SEND_API_TO_SERVER {
  type: "GSK_SEND_API_TO_SERVER";
  api: string;
}

export interface GSK_SEND_NOTIFICATION_TO_CLIENT {
  type: "GSK_SEND_NOTIFICATION_TO_CLIENT";
  payload: {
    title: string;
    message: string;
    type: "positive" | "negative" | "info" | "warning";
    duration?: number; // Optional duration in milliseconds
    icon?: string; // Optional icon class
  };
}

export interface GSK_SEND_STRUCTURED_TRANSCRIPT {
  type: "GSK_SEND_STRUCTURED_TRANSCRIPT";
  payload: {
    history: GSK_HISTORY_ELEMENT[];
  };
}

export interface GSK_SEND_PASSWORD_TO_CLIENT {
  type: "GSK_SEND_PASSWORD_TO_CLIENT";
  payload: {
    password: string;
  };
}

export interface GSK_SEND_SERVER_INTERNET_CONNECTIVITY {
  type: "GSK_SEND_SERVER_INTERNET_CONNECTIVITY";
  payload: {
    isConnected: boolean;
  };
}

export interface GSK_SEND_USER_CHAT_TO_SERVER {
  type: "GSK_SEND_USER_CHAT_TO_SERVER";
  payload: {
    chatMessage: string;
  };
}

export interface GSK_SEND_FULL_CHAT_HISTORY_TO_CLIENT {
  type: "GSK_SEND_FULL_CHAT_HISTORY_TO_CLIENT";
  payload: {
    chatHistory: GSK_CHAT_MESSAGE[];
  };
}

export interface GSK_SEND_LIST_OF_USEFUL_MODELS_TO_CLIENT {
  type: "GSK_SEND_LIST_OF_USEFUL_MODELS_TO_CLIENT";
  payload: {
    models: GSK_AI_MODEL[];
  };
}

export interface GSK_SEND_SELECTED_MODEL {
  type: "GSK_SEND_SELECTED_MODEL";
  payload: {
    model: GSK_AI_MODEL;
  };
}
