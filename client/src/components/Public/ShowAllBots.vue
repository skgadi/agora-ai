<template>
  <div class="my-image-gallery">
    <img src="img1.jpg" alt="pic 1" />
    <img src="img2.jpg" alt="pic 2" />
    <img src="img3.jpg" alt="pic 3" />
    <!-- Add more images here -->
  </div>
  <div class="row items-center justify-evenly">
    <template v-for="(bot, idx) in mainRoomStore.bots" :key="idx">
      <show-ai-bot :bot="bot" />
    </template>
  </div>
</template>
<script setup lang="ts">
import ShowAiBot from 'src/components/Public/ShowAiBot.vue';

import { useMainRoomStore } from 'src/stores/main-room-store';

const mainRoomStore = useMainRoomStore();
</script>
