<template>
  <q-img class="responsive-image" :src="bot.avatarIdle || defaultAvatar" />
  <div>
    <div class="image-container"></div>
    {{ bot.name }}
  </div>
</template>
<script setup lang="ts">
defineProps({
  bot: {
    type: Object as () => GSK_PARTICIPANT,
    required: true,
  },
});

import type { GSK_PARTICIPANT } from 'src/services/library/types/participants';
import defaultAvatar from 'assets/defualt-avatar.png'; // Correct path using @ alias
</script>

<style scoped lang="scss">
.responsive-image {
  max-width: 25vw; /* 25% of viewport width */
  max-height: 50vh; /* 50% of viewport height */
  width: auto;
  height: auto;
  display: block;
}
.image-container {
  align-items: center;
  width: 25vw;
  height: 100vh;
}
</style>
