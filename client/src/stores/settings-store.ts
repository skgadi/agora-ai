import { defineStore, acceptHMRUpdate } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    password: '123456',
    socketServerUrl: 'localhost:3000', // Default socket server URL
  }),

  getters: {
    getPassword: (state) => state.password,
  },

  actions: {
    setPassword(newPassword: string) {
      this.password = newPassword;
    },
    setSocketServerUrl(newUrl: string) {
      this.socketServerUrl = newUrl;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
