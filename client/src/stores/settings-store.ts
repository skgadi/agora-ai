import { defineStore, acceptHMRUpdate } from 'pinia';
import type { GSK_AI_MODEL } from 'src/services/library/types/ai-data-model';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    password: '123456',
    socketServerUrl: 'localhost:3000', // Default socket server URL
    availableAiModels: [] as GSK_AI_MODEL[],
    selectedAiModel: {
      modelId: 'select-a-model',
      modelName: 'Select a model',
    } as GSK_AI_MODEL,
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
    setAvailableAiModels(models: GSK_AI_MODEL[]) {
      this.availableAiModels = models;
    },
    setSelectedAiModel(model: GSK_AI_MODEL) {
      this.selectedAiModel = model;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
