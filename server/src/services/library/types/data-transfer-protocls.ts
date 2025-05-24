import type { GSK_FULL_EVENT_DATA } from "./participants";

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
