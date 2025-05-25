<template>
  <template v-if="userInteractionButtonPressed">
    <q-layout view="lHh Lpr lFf">
      <q-page-container>
        <div style="position: fixed; top: 32px; right: 32px; z-index: 1000">
          <connectivity-indicator />
        </div>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  <template v-else>
    <q-btn
      label="Press me"
      icon="touch_app"
      class="q-mt-md full-width"
      rounded
      outline
      color="primary"
      @click="userInteractionButtonPressed = true"
    />
  </template>
</template>
<script setup lang="ts">
import ConnectivityIndicator from 'src/components/Generic/ConnectivityIndicator.vue';

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

onMounted(() => {
  //console.log('DesktopLayout mounted');
  socketStore.initializeSocket();
});
</script>
