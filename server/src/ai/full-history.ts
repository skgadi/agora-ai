import {
  GSK_HISTORY_ELEMENT,
  GSK_HISTORY_INPUT_ELEMENT,
} from "../services/library/types/ai-data-model";
import { GSK_FULL_EVENT_DATA } from "../services/library/types/participants";

const event: GSK_FULL_EVENT_DATA = {
  event: {
    background: "",
    name: "",
    description: "",
    dynamics: "",
    language: "en-US",
  },
  participants: [],
  roles: [],
};

const fullTranscript: GSK_HISTORY_ELEMENT[] = [];

export const resetTheFullEventData = (newEvent: GSK_FULL_EVENT_DATA) => {
  setFullEventData(newEvent);
  clearFullTranscript();
};

const setFullEventData = (newEvent: GSK_FULL_EVENT_DATA) => {
  event.event = newEvent.event;
  event.participants = newEvent.participants;
  event.roles = newEvent.roles;
};
export const getFullEventData = () => {
  return event;
};

export const appendToFullTranscript = (
  newElement: GSK_HISTORY_INPUT_ELEMENT
) => {
  const fullElement: GSK_HISTORY_ELEMENT = {
    name: event.participants?.[newElement.participantIdx]?.name || "Unknown",
    role: event.participants?.[newElement.participantIdx]?.role || "Unknown",
    content: newElement.content,
  };
  fullTranscript.push(fullElement);
  console.log("Full Transcript:", fullTranscript);
  console.log("Full Transcript Length:", fullTranscript.length);
};
export const getFullTranscript = () => {
  return fullTranscript;
};
const clearFullTranscript = () => {
  fullTranscript.length = 0;
};

export const getPromptForAI = () => {
  return `
  # Event Details
  - **Event Name**: ${event.event.name}
  - **Event Description**: ${event.event.description}
  - **Event Dynamics**: ${event.event.dynamics}
  - **Event Language**: ${event.event.language}
  # Participants
  ${event.participants
    .map(
      (participant) =>
        `- **Name**: ${participant.name}\n  - **Role**: ${participant.role}\n  - **Bio**: ${participant.bio}`
    )
    .join("\n")}
  # Roles
  ${event.roles
    .map(
      (role) =>
        `- **Role Name**: ${role.name}\n  - **Description**: ${role.description}`
    )
    .join("\n")}
  # Transcript
  ${fullTranscript
    .map(
      (element) =>
        `- **Name**: ${element.name}\n  - **Role**: ${element.role}\n  - **Content**: ${element.content}`
    )
    .join("\n")}
    `;
};

export const getSystemPrompt = (idx: number) => {
  const participant = event.participants[idx];
  return `
  You are ${participant.name}, a ${participant.role} in the event "${event.event.name}".
  It is your turn to speak.
  You are a ${participant.bio} and you are expected to respond in the language "${event.event.language}".
  You are expected to respond in the same tone and style as the previous speakers.
  You are expected to respond in the same context as the previous speakers.
  You are expected to respond in the same context as the event dynamics.
  Your response should be just the content of the message, without any additional information.
  `;
};
