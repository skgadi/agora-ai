import { defineStore, acceptHMRUpdate } from 'pinia';
import type { GSK_AI_TEXT_TO_SPEAK_ELEMENT } from 'src/services/library/types/data-transfer-protocls';
import type { GSK_FULL_EVENT_DATA } from 'src/services/library/types/participants';
import { useSpeechStore } from 'src/stores/speech-store';

export const useMainRoomStore = defineStore('mainRoom', {
  state: () => ({
    fullEventData: null as GSK_FULL_EVENT_DATA | null,
    speakerIdx: -1 as number,
    speakerState: 'thinking' as 'thinking' | 'talking',
    textToSpeak: '' as string,
  }),

  getters: {
    getFullEventData: (state) => state.fullEventData,
    getTextToSpeak: (state) => state.textToSpeak,
    getAllParticipants: (state) => {
      if (state.fullEventData) {
        return state.fullEventData.participants;
      }
      return [];
    },
  },

  actions: {
    addTextToSpeak(inSpeakElement: GSK_AI_TEXT_TO_SPEAK_ELEMENT) {
      this.speakerIdx = inSpeakElement.speakerIdx;
      this.textToSpeak = inSpeakElement.text;
      const voiceName = this.fullEventData?.participants[this.speakerIdx]?.type;
      const speechStore = useSpeechStore();
      speechStore.speak(this.textToSpeak, this.speakerIdx, voiceName || '');
    },
    setTalkingState() {
      this.speakerState = 'talking';
    },
    clearTextToSpeak() {
      this.textToSpeak = '';
      this.speakerIdx = -1;
      this.speakerState = 'thinking';
    },
    resetFullEvent(fullEventData: GSK_FULL_EVENT_DATA) {
      this.fullEventData = fullEventData;
      this.clearTextToSpeak();
    },
    setThinkingSpeakerIdx(speakerIdx: number) {
      this.speakerIdx = speakerIdx;
      this.speakerState = 'thinking';
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainRoomStore, import.meta.hot));
}
