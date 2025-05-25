import { defineStore, acceptHMRUpdate } from 'pinia';

export const useAppUpdateStore = defineStore('appUpdate', {
  state: () => ({
    updateAvailable: false,
    updateFinished: false,
  }),

  getters: {
    isUpdateAvailable: (state) => state.updateAvailable,
    isUpdateFinished: (state) => state.updateFinished,
  },

  actions: {
    setUpdateAvailable(value: boolean) {
      this.updateAvailable = value;
    },
    setUpdateFinished(value: boolean) {
      this.updateFinished = value;
    },
    resetUpdateStatus() {
      this.updateAvailable = false;
      this.updateFinished = false;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppUpdateStore, import.meta.hot));
}
