<template>
  <q-item clickable v-ripple @click="requestToDownloadStructuredTranscript">
    <q-item-section avatar>
      <q-icon color="accent" name="download" />
    </q-item-section>
    <q-item-section>Download structured transcript</q-item-section>
  </q-item>
</template>
<script lang="ts" setup>
import { useSocketStore } from 'src/stores/socket-store';

const socketStore = useSocketStore();

const requestToDownloadStructuredTranscript = () => {
  socketStore.emit('admin-activities-request-structured-transcript');
};
</script>
