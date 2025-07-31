<template>
  <template v-if="userInteractionButtonPressed">
    <q-layout view="lHh Lpr lFf">
      <q-page-container>
        <UpdateRibbon ref="updateRibbon" />
        <div style="position: fixed; top: 32px; right: 96px; z-index: 1000">
          <connectivity-indicator />
        </div>
        <div style="position: fixed; top: 32px; right: 32px; z-index: 1000">
          <server-internet-indicator />
        </div>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  <template v-else>
    <div
      class="q-pa-md row items-center justify-center"
      style="height: 100vh; background-color: #000000"
    >
      <q-btn
        label="Press me"
        icon="touch_app"
        class="q-mt-md press-me-button"
        size="lg"
        no-caps
        rounded
        outline
        color="primary"
        @click="userInteractionButtonPressed = true"
      />
    </div>
  </template>
  <watermark-logo />
</template>
<script setup lang="ts">
import ConnectivityIndicator from 'src/components/Generic/ConnectivityIndicator.vue';
import ServerInternetIndicator from 'src/components/Generic/ServerInternetIndicator.vue';
import UpdateRibbon from 'components/Generic/UpdateRibbon.vue';
import WatermarkLogo from 'src/components/Generic/WatermarkLogo.vue';

import { onMounted } from 'vue';
import { useSocketStore } from 'src/stores/socket-store';
import { useSpeechStore } from 'src/stores/speech-store';
import { ref } from 'vue';

const socketStore = useSocketStore();
const speechStore = useSpeechStore();

const userInteractionButtonPressed = ref(false);

window.speechSynthesis.onvoiceschanged = () => {
  speechStore.loadVoicesIfNotLoaded();
  speechStore.isSpeakingWindow = true;
};

onMounted(async () => {
  //console.log('DesktopLayout mounted');
  await socketStore.initializeSocket();
});
</script>
<style scoped lang="scss">
/**
A class that pulsates as if it is requesting user to press a button.
*/
.press-me-button {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0.7);
  }
}
</style>
