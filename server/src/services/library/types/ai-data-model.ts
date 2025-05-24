export interface GSK_AI_DATA_MODEL {
  prompt: string;
  model: string;
  config: {
    systemInstructions: string;
  };
}

export interface GSK_HISTORY_ELEMENT {
  chatRole: "user" | "model";
  name: string;
  role: string;
  content: string;
}

export interface GSK_IN_AUDIO_ELEMENT {
  speaker: string;
  role: string;
  localUrl: string;
}

export interface GSK_FULL_AUDIO_ELEMENT extends GSK_IN_AUDIO_ELEMENT {
  transcript: string;
}
