<template>
  <q-page class="row items-center justify-evenly">
    <template v-if="mainRoomStore.getFullEventData">
      {{ mainRoomStore.fullEventData }}
    </template>
    <template v-else> Please wait while the data is loading... </template>
  </q-page>
</template>

<script setup lang="ts">
import { useMainRoomStore } from 'src/stores/main-room-store';

const mainRoomStore = useMainRoomStore();
</script>
