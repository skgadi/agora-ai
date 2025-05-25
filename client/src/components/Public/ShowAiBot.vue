<template>
  <div class="image-container">
    <div class="text-h6 text-visible text-center">
      {{ bot.name }} {{ speechStore.isSpeakingWindow }} ({{ myState }})
    </div>
    <q-img class="responsive-image" :src="getAvatar" />
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  bot: {
    type: Object as () => GSK_PARTICIPANT,
    required: true,
  },
  myIndex: {
    type: Number,
    default: 0,
  },
});

import type { GSK_PARTICIPANT } from 'src/services/library/types/participants';
import defaultAvatar from 'assets/defualt-avatar.png'; // Correct path using @ alias
import { useMainRoomStore } from 'src/stores/main-room-store';
import { useSpeechStore } from 'src/stores/speech-store';
import { computed } from 'vue';

const mainRoomStore = useMainRoomStore();
const speechStore = useSpeechStore();

const myState = computed(() => {
  if (mainRoomStore.speakerIdx === props.myIndex) {
    return mainRoomStore.speakerState;
  }
  return 'idle';
});

const getAvatar = computed(() => {
  switch (myState.value) {
    case 'idle':
      return props.bot.avatarIdle || defaultAvatar;
    case 'talking':
      return props.bot.avatarTalking || defaultAvatar;
    case 'thinking':
      return props.bot.avatarThinking || defaultAvatar;
    default:
      return defaultAvatar;
  }
});
</script>

<style scoped lang="scss">
.image-container {
  width: 100%; /* or any specific width like 600px */
  max-width: 25vw; /* optional: limit the maximum width */
  margin: 0 auto; /* center the container */
}

.responsive-image {
  width: 100%; /* fit the container's width */
  height: auto; /* maintain aspect ratio */
  display: block; /* remove inline spacing */
  object-fit: contain; /* ensures no cropping even if container has fixed height */
}
.text-visible {
  color: white;
  text-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.8),
    /* dark shadow for light backgrounds */ -2px -2px 4px rgba(0, 0, 0, 0.8),
    /* top-left dark shadow */ 2px -2px 4px rgba(0, 0, 0, 0.8),
    /* top-right dark shadow */ -2px 2px 4px rgba(0, 0, 0, 0.8); /* bottom-left dark shadow */
}
</style>
