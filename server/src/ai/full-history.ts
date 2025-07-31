import {
  GSK_HISTORY_ELEMENT,
  GSK_HISTORY_INPUT_ELEMENT,
} from "../services/library/types/ai-data-model.js";
import { GSK_FULL_EVENT_DATA } from "../services/library/types/participants.js";

const event: GSK_FULL_EVENT_DATA = {
  event: {
    background: "",
    name: "Chrononauts and Causality: A Debate on the Possibility of Time Travel",
    description:
      "This event will be a mind-bending debate on the scientific and philosophical feasibility of time travel. The panel will discuss topics such as the Grandfather Paradox, the physics of wormholes and black holes, and why we haven't been visited by tourists from the future.",
    dynamics:
      "A structured debate with three rounds. Round 1: Each panelist presents their argument for or against time travel. Round 2: The panelists engage in a moderated discussion and address each other's points. Round 3: The audience asks questions, and the panelists provide closing remarks.",
    language: "en-US",
  },
  participants: [
    {
      type: "human",
      avatarIdle: "",
      avatarListening: "",
      avatarThinking: "",
      avatarTalking: "",
      name: "Dr. Aris Thorne",
      bio: "Dr. Thorne is a leading theoretical physicist with a Ph.D. from Caltech. His work focuses on general relativity and quantum mechanics, with several published papers on wormhole stability and spacetime geometry in peer-reviewed journals. He was awarded the prestigious Einstein Medal for his contributions to theoretical physics.",
      role: "The Physicist",
    },
    {
      type: "human",
      avatarIdle: "",
      avatarListening: "",
      avatarThinking: "",
      avatarTalking: "",
      name: "Dr. Lena Petrova",
      bio: "Dr. Petrova is a highly respected philosopher with a Ph.D. in Metaphysics from Oxford University. Her research centers on causality, identity, and the logic of time. She is the author of the book 'The Logic of Loops: Paradoxes in Time and Existence' and is a sought-after speaker at international philosophy conferences.",
      role: "The Philosopher",
    },
    {
      type: "human",
      avatarIdle: "",
      avatarListening: "",
      avatarThinking: "",
      avatarTalking: "",
      name: "Alex Vance",
      bio: "Alex Vance is an acclaimed science fiction author known for a series of novels exploring time-travel paradoxes. A graduate of NYU's film school, Vance has also worked as a screenwriter for several major studio films. Their work has been nominated for a Hugo Award, and they frequently appear as a consultant on projects involving complex sci-fi concepts.",
      role: "The Storyteller",
    },
  ],
  roles: [
    {
      name: "The Physicist",
      description:
        "A scientist who explains the theoretical possibilities of time travel based on our current understanding of physics.",
    },
    {
      name: "The Philosopher",
      description:
        "A thinker who focuses on the logical and metaphysical problems associated with time travel, such as paradoxes and the nature of free will.",
    },
    {
      name: "The Storyteller",
      description:
        "A pop culture expert who uses examples from fiction to make complex scientific ideas more accessible and engaging for the audience.",
    },
  ],
};
const fullTranscript: GSK_HISTORY_ELEMENT[] = [];

export const resetTheFullEventData = (newEvent: GSK_FULL_EVENT_DATA) => {
  setFullEventData(newEvent);
  clearFullTranscript();
};

export const contiueEventWithHistory = (newEvent: GSK_FULL_EVENT_DATA) => {
  setFullEventData(newEvent);
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
  //console.log("Full Transcript:", fullTranscript);
  console.log("Full Transcript Length:", fullTranscript.length);
};
export const getFullTranscript = () => {
  return fullTranscript;
};
const clearFullTranscript = () => {
  fullTranscript.length = 0;
};

export const setFullTranscript = (newTranscript: GSK_HISTORY_ELEMENT[]) => {
  fullTranscript.length = 0; // Clear the existing transcript
  fullTranscript.push(...newTranscript); // Add the new transcript elements
  //console.log("Full Transcript Set:", fullTranscript);
  console.log("Full Transcript Length Set:", fullTranscript.length);
};

export const getPromptForAI = () => {
  return `
  # Event Details
  - **Event Name**: ${event.event.name}
  - **Event Description**: ${event.event.description}
  - **Event Dynamics**: ${event.event.dynamics}
  - **Event Language**: ${event.event.language}
  # Roles
  ${event.roles
    .map(
      (role) =>
        `- **Role Name**: ${role.name}\n  - **Description**: ${role.description}`
    )
    .join("\n")}
  # Participants
  ${event.participants
    .map(
      (participant) =>
        `- **Name**: ${participant.name}\n  - **Role**: ${participant.role}\n  - **Bio**: ${participant.bio}`
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

/**
 * This function generates a human-readable report of the event, participants, roles, and transcript.
 * It should be in markdown format.
 * It should be used to record the event in a human-readable format.
 * It should be used to generate a report of the event.
 */
export const getHumanReadableReport = () => {
  return `
# Event Report: ${event.event.name}
## Event Details
- **Description**: ${event.event.description}
- **Dynamics**: ${event.event.dynamics}
- **Language**: ${event.event.language}
## Roles
${event.roles
  .map(
    (role) =>
      `- **Role Name**: ${role.name}\n  - **Description**: ${role.description}`
  )
  .join("\n")}
## Participants
${event.participants
  .map(
    (participant) =>
      `- **Name**: ${participant.name}\n  - **Role**: ${participant.role}\n  - **Bio**: ${participant.bio}`
  )
  .join("\n")}
## Transcript
${fullTranscript
  .map(
    (element) =>
      `- **Name**: ${element.name}\n  - **Role**: ${element.role}\n  - **Content**: ${element.content}`
  )
  .join("\n")}
  `;
};
