<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div style="position: fixed; top: 32px; right: 32px; z-index: 1000">
        <connectivity-indicator />
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import ConnectivityIndicator from 'src/components/Generic/ConnectivityIndicator.vue';

import { onMounted } from 'vue';
import { useSocketStore } from 'src/stores/socket-store';
import { useSpeechStore } from 'src/stores/speech-store';

const socketStore = useSocketStore();
const speechStore = useSpeechStore();

window.speechSynthesis.onvoiceschanged = () => {
  speechStore.loadVoicesIfNotLoaded();
};

onMounted(() => {
  //console.log('DesktopLayout mounted');
  socketStore.initializeSocket();
});
</script>
