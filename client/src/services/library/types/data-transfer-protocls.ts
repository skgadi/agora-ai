import type { GSK_PARTICIPANT, GSK_FULL_EVENT_DATA } from './participants';

export interface GSK_SETTINGS_TO_INIT_AI {
  type: 'GSK_SETTINGS_TO_INIT_AI';
  payload: GSK_FULL_EVENT_DATA;
}

export interface GSK_VOICE_INPUT_TO_SERVER {
  type: 'GSK_VOICE_INPUT_TO_SERVER';
  payload: {
    voiceBlob: Blob;
    speaker: GSK_PARTICIPANT;
  };
}
