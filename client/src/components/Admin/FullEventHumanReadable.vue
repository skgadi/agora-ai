<template>
  <q-btn
    icon="cloud_download"
    color="negative"
    outline
    rounded
    no-caps
    label="Receive from Server"
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
