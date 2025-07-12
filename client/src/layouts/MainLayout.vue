<template>
  <router-view />
  <watermark-logo />
</template>

<script setup lang="ts">
import WatermarkLogo from 'src/components/Generic/WatermarkLogo.vue';

import { onMounted } from 'vue';
import { useSocketStore } from 'src/stores/socket-store';
import { useSpeechStore } from 'src/stores/speech-store';

const socketStore = useSocketStore();
const speechStore = useSpeechStore();

window.speechSynthesis.onvoiceschanged = () => {
  speechStore.loadVoicesIfNotLoaded();
  speechStore.isSpeakingWindow = false;
};

onMounted(() => {
  //console.log('DesktopLayout mounted');
  socketStore.initializeSocket();
});
</script>
