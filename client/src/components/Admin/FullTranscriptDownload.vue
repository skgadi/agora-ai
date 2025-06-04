<template>
  <q-btn
    icon="download"
    color="accent"
    outline
    rounded
    no-caps
    label="Transcripts"
    @click="requestToDownloadStructuredTranscript"
  />
</template>
<script lang="ts" setup>
import { useSocketStore } from 'src/stores/socket-store';

const socketStore = useSocketStore();

const requestToDownloadStructuredTranscript = () => {
  socketStore.emit('admin-activities-request-structured-transcript');
};
</script>
