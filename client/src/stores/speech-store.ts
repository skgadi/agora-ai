import { defineStore, acceptHMRUpdate } from 'pinia';

import { useMainRoomStore } from 'src/stores/main-room-store';

export const useSpeechStore = defineStore('speechStore', {
  state: () => ({
    voices: [] as SpeechSynthesisVoice[],
    speakerVoice: null as SpeechSynthesisVoice | null,
    isSpeakingActivityInProgress: false as boolean,
    textToSpeak: '' as string,
    speakerIdx: -1 as number,
    utterance: null as SpeechSynthesisUtterance | null,
  }),

  getters: {
    allVoicesOptions: (state) => {
      return state.voices.map((voice) => ({
        label: voice.name,
        value: voice.name,
      }));
    },
    listAllUniqueLanguages: (state) => {
      const uniqueLanguages = new Set<string>();
      state.voices.forEach((voice) => {
        if (voice.lang) {
          uniqueLanguages.add(voice.lang);
        }
      });
      return Array.from(uniqueLanguages);
    },
  },

  actions: {
    loadVoices() {
      this.voices = window.speechSynthesis.getVoices();
    },
    loadVoicesIfNotLoaded() {
      if (this.voices.length === 0) {
        this.loadVoices();
      }
    },
    speak(inTxt: string, inSpeakerIdx: number, inSpeakerVoiceName: string) {
      console.log('speak', inTxt, inSpeakerIdx, inSpeakerVoiceName);
      if (this.voices.length === 0) {
        console.warn('Voices not loaded yet, please wait.');
        this.loadVoices();
        return;
      }
      if (this.isSpeakingActivityInProgress) {
        console.warn('Already speaking, please wait until the current speech is finished.');
        return;
      }

      this.textToSpeak = inTxt;
      this.speakerIdx = inSpeakerIdx;
      const inSpeakerVoice =
        this.voices.find((voice) => voice.name === inSpeakerVoiceName) || this.voices[0];
      console.log('inSpeakerVoice', inSpeakerVoice);

      if (inSpeakerVoice) {
        this.isSpeakingActivityInProgress = true;
        this.utterance = new SpeechSynthesisUtterance(inTxt);
        this.utterance.voice = inSpeakerVoice;
        this.utterance.onstart = () => {
          const mainRoomStore = useMainRoomStore();
          mainRoomStore.setTalkingState();
          console.log('Speech started');
        };
        this.utterance.onend = () => {
          console.log('Speech ended');
          const mainRoomStore = useMainRoomStore();
          this.textToSpeak = '';
          this.isSpeakingActivityInProgress = false;
          this.speakerIdx = -1;
          mainRoomStore.clearTextToSpeak();
        };
        this.utterance.onerror = (event) => {
          const mainRoomStore = useMainRoomStore();
          console.error('Speech synthesis error:', event.error);
          this.isSpeakingActivityInProgress = false;
          this.textToSpeak = '';
          this.speakerIdx = -1;
          mainRoomStore.clearTextToSpeak();
        };
        window.speechSynthesis.speak(this.utterance);
      }
    },
    forceStopSpeaking() {
      window.speechSynthesis.cancel();
      this.isSpeakingActivityInProgress = false;
      this.textToSpeak = '';
      this.speakerIdx = -1;
      const mainRoomStore = useMainRoomStore();
      mainRoomStore.clearTextToSpeak();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSpeechStore, import.meta.hot));
}
