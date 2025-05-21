import { defineStore, acceptHMRUpdate } from 'pinia';

export const useMainRoomStore = defineStore('mainRoom', {
  state: () => ({
    textToTalk: [] as string[],
    emojiesToDisplay: [] as string[],
  }),

  getters: {
    getTextToTalk: (state) => state.textToTalk,
    popTextToTalk: (state) => {
      const text = state.textToTalk.pop();
      return text ? text : '';
    },
  },

  actions: {
    addTextToTalk(text: string) {
      this.textToTalk.push(text);
    },
    addEmojiToDisplay(emoji: string) {
      this.emojiesToDisplay.push(emoji);
    },
    popEmojiToDisplay() {
      const emoji = this.emojiesToDisplay.pop();
      return emoji ? emoji : '';
    },
    clearTextToTalk() {
      this.textToTalk = [];
    },
    clearEmojiToDisplay() {
      this.emojiesToDisplay = [];
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainRoomStore, import.meta.hot));
}
