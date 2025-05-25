export interface GSK_PARTICIPANT {
  type: string;
  name: string;
  role: string;
  bio: string;
  avatarIdle: string;
  avatarListening: string;
  avatarThinking: string;
  avatarTalking: string;
}

export interface GSK_ROLE {
  name: string;
  description: string;
}

export interface GSK_EVENT {
  name: string;
  description: string;
  dynamics: string;
  background: string;
  language: 'en-US' | 'es-MX';
}

export interface GSK_FULL_EVENT_DATA {
  event: GSK_EVENT;
  participants: GSK_PARTICIPANT[];
  roles: GSK_ROLE[];
}

export interface GSK_TYPES {
  name: string;
  voice: 'male' | 'female';
  accent: 'en-US' | 'es-MX';
}
