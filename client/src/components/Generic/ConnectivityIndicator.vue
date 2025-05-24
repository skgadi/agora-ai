<template>
  <div class="text-visible">
    <q-icon :name="icon" size="lg" />
  </div>
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
<style scoped lang="scss">
.text-visible {
  color: white;
  text-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.8),
    /* dark shadow for light backgrounds */ -2px -2px 4px rgba(0, 0, 0, 0.8),
    /* top-left dark shadow */ 2px -2px 4px rgba(0, 0, 0, 0.8),
    /* top-right dark shadow */ -2px 2px 4px rgba(0, 0, 0, 0.8); /* bottom-left dark shadow */
}
</style>
