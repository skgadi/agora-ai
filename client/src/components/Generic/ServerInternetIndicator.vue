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
  if (socketStore.isServerConnectedToInternet) {
    return 'mdi-web-check';
  } else {
    return 'mdi-web-cancel';
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
