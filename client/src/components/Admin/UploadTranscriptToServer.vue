<template>
  <q-item clickable v-ripple @click="triggerFileInput">
    <q-item-section avatar>
      <q-icon color="secondary" name="upload_file" />
    </q-item-section>
    <q-item-section>Upload transcripts</q-item-section>
  </q-item>
  <input ref="fileInput" type="file" accept=".json" style="display: none" @change="uploadJson" />
</template>
<script lang="ts" setup>
const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
});

import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useSocketStore } from 'src/stores/socket-store';
import { type GSK_HISTORY_ELEMENT } from 'src/services/library/types/ai-data-model';
import { type GSK_SEND_STRUCTURED_TRANSCRIPT } from 'src/services/library/types/data-transfer-protocls';

const socketStore = useSocketStore();

// Reference to the hidden file input element
const fileInput = ref<HTMLInputElement | null>(null);

// Quasar instance for notifications
const $q = useQuasar();

// Function to trigger the hidden file input
const triggerFileInput = () => {
  if (!props.isEditing) {
    $q.notify({
      type: 'warning',
      message: 'You cannot upload a new transcript while the event is active.',
    });
    return;
  }
  if (fileInput.value) {
    fileInput.value.click();
  }
};

function validateHistoryContent(jsonString: string): boolean {
  if (!jsonString.trim()) return false;

  try {
    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed)) return false;

    for (const item of parsed) {
      if (
        typeof item !== 'object' ||
        typeof item.name !== 'string' ||
        typeof item.role !== 'string' ||
        typeof item.content !== 'string'
      ) {
        console.log('Invalid item structure:', item);
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

// Function to handle file upload and update the reference variable with validation
const uploadJson = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = e.target?.result as string;
        //console.log('File content:', fileContent);
        if (validateHistoryContent(fileContent)) {
          const jsonData = JSON.parse(fileContent);
          console.log('Parsed JSON data:', jsonData);
          $q.notify({
            type: 'positive',
            message: 'JSON uploaded successfully!',
          });
          const historyData: GSK_HISTORY_ELEMENT[] = jsonData as GSK_HISTORY_ELEMENT[];
          const payload: GSK_SEND_STRUCTURED_TRANSCRIPT = {
            type: 'GSK_SEND_STRUCTURED_TRANSCRIPT',
            payload: {
              history: historyData,
            },
          };
          console.log('Emitting structured transcript:', payload);
          // Emit the history data to the socket
          socketStore.emit('admin-activities-replace-full-history', payload);
        } else {
          $q.notify({
            type: 'negative',
            message: 'Invalid JSON structure. Please check the format.',
          });
          console.error('Invalid JSON structure:', fileContent);
        }
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Error parsing JSON file. Please ensure it is valid.',
        });
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
    input.value = ''; // Reset the input after reading
  }
};
</script>
