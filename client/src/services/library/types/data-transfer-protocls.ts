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
