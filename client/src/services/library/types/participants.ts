export interface GSK_PARTICIPANT {
  type: 'human' | keyof typeof gsk_types;
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

export const gsk_types = {
  'us-male': {
    name: 'John Doe',
    voice: 'male',
    accent: 'en-US',
  },
  'us-female': {
    name: 'Jane Doe',
    voice: 'female',
    accent: 'en-US',
  },
  'mx-male': {
    name: 'Juan Pérez',
    voice: 'male',
    accent: 'es-MX',
  },
  'mx-female': {
    name: 'Juana Pérez',
    voice: 'female',
    accent: 'es-MX',
  },
};
