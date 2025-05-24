<template>
  <q-page
    class="row items-center justify-evenly"
    style="width: 100vw; height: 100vh; background-color: #000000; overflow: hidden"
    :style="`background: url('${event?.background || defaultBackgroundImage}'); background-size: cover; background-repeat: no-repeat; background-position: center;`"
  >
    <template v-if="mainRoomStore.getFullEventData">
      <div
        class="text-h4 text-visible text-center"
        style="position: fixed; top: 10%; width: 100%; color: white"
      >
        {{ event?.name }}
      </div>
      <div class="full-width">
        <show-all-bots />
      </div>
    </template>
    <template v-else> Please wait while the data is loading... </template>
  </q-page>
</template>

<script setup lang="ts">
import ShowAllBots from 'src/components/Public/ShowAllBots.vue';

import { useMainRoomStore } from 'src/stores/main-room-store';
import { computed } from 'vue';
import defaultBackgroundImage from 'assets/default-background.jpg'; // Correct path using @ alias

const mainRoomStore = useMainRoomStore();

const event = computed(() => {
  return mainRoomStore.fullEventData?.event;
});
</script>

<style scoped lang="scss">
.text-visible {
  color: white;
  text-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.8),
    /* dark shadow for light backgrounds */ -2px -2px 4px rgba(0, 0, 0, 0.8),
    /* top-left dark shadow */ 2px -2px 4px rgba(0, 0, 0, 0.8),
    /* top-right dark shadow */ -2px 2px 4px rgba(0, 0, 0, 0.8); /* bottom-left dark shadow */
}
</style>
