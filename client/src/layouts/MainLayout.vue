<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Panelist-AI</q-toolbar-title>
        <q-space />
        <connectivity-indicator />
      </q-toolbar>
    </q-header>

    <q-page-container>
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
