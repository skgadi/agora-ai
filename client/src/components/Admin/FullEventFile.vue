<template>
  <div class="row items-center justify-evenly">
    <div>
      <set-api-code />
    </div>
    <div>
      <q-btn
        color="primary"
        outline
        rounded
        icon="save"
        no-caps
        label="Model"
        @click="downloadJson"
        class="q-mr-md"
      />
    </div>
    <div>
      <q-btn
        icon="upload_file"
        color="secondary"
        outline
        rounded
        no-caps
        label="Model"
        @click="triggerFileInput"
      />
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        style="display: none"
        @change="uploadJson"
      />
    </div>
    <div>
      <receive-full-event-data-from-server v-model="fullEventData" />
    </div>
    <div>
      <full-transcript-download />
    </div>
    <div>
      <upload-transcript-to-server />
    </div>
    <div>
      <full-event-human-readable />
    </div>
  </div>
</template>
<script lang="ts" setup>
const fullEventData = defineModel<GSK_FULL_EVENT_DATA>({
  required: true,
});

import ReceiveFullEventDataFromServer from 'src/components/Admin/ReceiveFullEventDataFromServer.vue';
import FullTranscriptDownload from 'src/components/Admin/FullTranscriptDownload.vue';
import FullEventHumanReadable from 'src/components/Admin/FullEventHumanReadable.vue';
import UploadTranscriptToServer from 'src/components/Admin/UploadTranscriptToServer.vue';
import SetApiCode from 'src/components/Admin/SetApiCode.vue';

import type {
  GSK_EVENT,
  GSK_FULL_EVENT_DATA,
  GSK_PARTICIPANT,
  GSK_ROLE,
} from 'src/services/library/types/participants';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

// Reference to the hidden file input element
const fileInput = ref<HTMLInputElement | null>(null);

// Quasar instance for notifications
const $q = useQuasar();

// Function to download the JSON data
const downloadJson = () => {
  const jsonString = JSON.stringify(fullEventData.value, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'event_data.json'; // File name for download
  link.click();
  URL.revokeObjectURL(url); // Clean up the URL object
};

// Function to trigger the hidden file input
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Helper function to validate the uploaded JSON against the interface
const isValidGSKFullEventData = (data: unknown): data is GSK_FULL_EVENT_DATA => {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Partial<GSK_FULL_EVENT_DATA>;

  // Check if required properties exist and have the correct structure
  if (!obj.event || typeof obj.event !== 'object') return false;
  if (!Array.isArray(obj.participants)) return false;
  if (!Array.isArray(obj.roles)) return false;

  // Validate event properties
  const event = obj.event as Partial<GSK_EVENT>;
  if (
    typeof event.name !== 'string' ||
    typeof event.description !== 'string' ||
    typeof event.dynamics !== 'string' ||
    typeof event.background !== 'string' ||
    typeof event.language !== 'string'
  ) {
    return false;
  }

  // Validate participants array (if not empty)
  if (
    obj.participants.length > 0 &&
    !obj.participants.every((p) => {
      const participant = p as Partial<GSK_PARTICIPANT>;
      return (
        typeof participant.type === 'string' &&
        typeof participant.name === 'string' &&
        typeof participant.role === 'string' &&
        typeof participant.bio === 'string' &&
        typeof participant.avatarIdle === 'string' &&
        typeof participant.avatarListening === 'string' &&
        typeof participant.avatarThinking === 'string' &&
        typeof participant.avatarTalking === 'string'
      );
    })
  ) {
    return false;
  }

  // Validate roles array (if not empty)
  if (
    obj.roles.length > 0 &&
    !obj.roles.every((r) => {
      const role = r as Partial<GSK_ROLE>;
      return typeof role.name === 'string' && typeof role.description === 'string';
    })
  ) {
    return false;
  }

  return true;
};

// Function to handle file upload and update the reference variable with validation
const uploadJson = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        if (isValidGSKFullEventData(jsonData)) {
          fullEventData.value = jsonData; // Update the reactive reference with validated data
          $q.notify({
            type: 'positive',
            message: 'JSON uploaded successfully!',
          });
          console.log('Uploaded JSON:', jsonData);
        } else {
          $q.notify({
            type: 'negative',
            message: 'Invalid JSON structure. Please check the format.',
          });
          console.error('Invalid JSON structure:', jsonData);
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
