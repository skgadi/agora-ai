import { type GSK_PARTICIPANT } from './participants';

export interface GSK_SETTINGS_TO_INIT_AI {
  type: 'GSK_SETTINGS_TO_INIT_AI';
  payload: {
    settings: {
      language: string;
      talkTopic: string;
      talkDescription: string;
      aiRole: string;
      aiDescription: string;
      participants: GSK_PARTICIPANT[];
    };
  };
}

export interface GSK_VOICE_INPUT_TO_SERVER {
  type: 'GSK_VOICE_INPUT_TO_SERVER';
  payload: {
    voiceBlob: Blob;
    speaker: GSK_PARTICIPANT;
  };
}
