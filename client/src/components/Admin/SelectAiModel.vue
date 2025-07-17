<template>
  <q-select
    v-model="selectedModel"
    :options="settingsStore.availableAiModels"
    option-label="modelName"
    label="Select AI Model"
    emit-value
    map-options
    outlined
    rounded
    class="q-ma-md"
  />
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { useSettingsStore } from 'src/stores/settings-store';
import { useSocketStore } from 'src/stores/socket-store';
import type { GSK_AI_MODEL } from 'src/services/library/types/ai-data-model';
import type { GSK_SEND_SELECTED_MODEL } from 'src/services/library/types/data-transfer-protocls';

const settingsStore = useSettingsStore();
const socketStore = useSocketStore();

const selectedModel = ref<GSK_AI_MODEL>({
  modelId: '',
  modelName: '',
});

onMounted(() => {
  // Load the selected model from settings store
  selectedModel.value = settingsStore.selectedAiModel;
});

watch(
  () => settingsStore.selectedAiModel,
  () => {
    selectedModel.value = settingsStore.selectedAiModel;
  },
);

watch(
  () => selectedModel.value,
  (newModel) => {
    console.log('Selected AI Model changed:', newModel);
    if (newModel.modelId && newModel.modelName) {
      const payload: GSK_SEND_SELECTED_MODEL = {
        type: 'GSK_SEND_SELECTED_MODEL',
        payload: {
          model: newModel,
        },
      };
      socketStore.emit('admin-activities-set-ai-model', payload);
    }
  },
);
</script>
