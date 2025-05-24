import { defineStore, acceptHMRUpdate } from 'pinia';
import type { GSK_AI_TEXT_TO_SPEAK_ELEMENT } from 'src/services/library/types/data-transfer-protocls';
import type { GSK_FULL_EVENT_DATA } from 'src/services/library/types/participants';

export const useMainRoomStore = defineStore('mainRoom', {
  state: () => ({
    fullEventData: null as GSK_FULL_EVENT_DATA | null,
    textToSpeak: [] as GSK_AI_TEXT_TO_SPEAK_ELEMENT[],
    stopTalking: false as boolean,
  }),

  getters: {
    getFullEventData: (state) => state.fullEventData,
    getTextToSpeak: (state) => state.textToSpeak,
    popTextToSpeak: (state) => {
      const text = state.textToSpeak.pop();
      return text ? text : null;
    },
    bots: (state) => {
      if (!state.fullEventData) return [];
      return state.fullEventData.participants.filter((participant) => participant.type !== 'human');
    },
  },

  actions: {
    addTextToSpeak(text: GSK_AI_TEXT_TO_SPEAK_ELEMENT) {
      this.textToSpeak.push(text);
    },
    clearTextToSpeak() {
      this.textToSpeak = [];
    },
    resetFullEvent(fullEventData: GSK_FULL_EVENT_DATA) {
      this.fullEventData = fullEventData;
      this.clearTextToSpeak();
    },
    setStartTalking(speakerIdx: number) {
      console.log(`Start talking for speaker index: ${speakerIdx}`);
      this.stopTalking = false;
    },
    setStopTalking(speakerIdx: number) {
      console.log(`Stop talking for speaker index: ${speakerIdx}`);
      this.stopTalking = true;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainRoomStore, import.meta.hot));
}
