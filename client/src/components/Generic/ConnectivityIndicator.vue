<template>
  <q-icon :name="icon" size="lg" />
</template>
<script setup lang="ts">
import { useSocketStore } from 'src/stores/socket-store';
import { computed } from 'vue';
const socketStore = useSocketStore();
const icon = computed(() => {
  if (socketStore.isConnected) {
    if (socketStore.sentActivity && socketStore.receivedActivity) {
      return 'mdi-arrow-down-thin';
    } else if (socketStore.sentActivity) {
      return 'mdi-arrow-up-thin';
    } else if (socketStore.receivedActivity) {
      return 'mdi-swap-vertical';
    } else {
      return 'mdi-link';
    }
  } else {
    return 'mdi-link-off';
  }
});
</script>
