<template>
  <q-item clickable v-ripple @click="setTheAPIToServer">
    <q-item-section avatar>
      <q-icon color="primary" name="mdi-key-outline" />
    </q-item-section>
    <q-item-section>Set Gemini's API key</q-item-section>
  </q-item>
</template>
<script lang="ts" setup>
import { useSocketStore } from 'src/stores/socket-store';
import type { GSK_SEND_API_TO_SERVER } from 'src/services/library/types/data-transfer-protocls';

const socketStore = useSocketStore();

const setTheAPIToServer = () => {
  const apiCode = prompt('Enter the API code for Gemini:');
  if (apiCode === null) {
    // User cancelled the prompt
    return;
  }
  if (apiCode.trim() === '') {
    alert('API code cannot be empty.');
    return;
  }

  const payload: GSK_SEND_API_TO_SERVER = {
    type: 'GSK_SEND_API_TO_SERVER',
    api: apiCode.trim(),
  };

  socketStore.emit('admin-activities-set-api-code', payload);
};
</script>
