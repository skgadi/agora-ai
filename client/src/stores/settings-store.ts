import { defineStore, acceptHMRUpdate } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    password: '5sH8pO19f$?~',
  }),

  getters: {
    getPassword: (state) => state.password,
  },

  actions: {
    setPassword(newPassword: string) {
      this.password = newPassword;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
