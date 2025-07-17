export interface GSK_AI_DATA_MODEL {
  model: string;
  systemInstructions: string;
  prompt: string;
}

export interface GSK_HISTORY_ELEMENT {
  name: string;
  role: string;
  content: string;
}

export interface GSK_HISTORY_INPUT_ELEMENT {
  participantIdx: number;
  content: string;
}

export interface GSK_IN_AUDIO_ELEMENT {
  speakerIdx: number;
  localUrl: string;
}

export interface GSK_CHAT_MESSAGE {
  who: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface GSK_AI_MODEL {
  modelId: string;
  modelName: string;
}
