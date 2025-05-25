<template>
  <div class="row items-center justify-evenly">
    <template v-for="(bot, idx) in mainRoomStore.getAllParticipants" :key="idx">
      <template v-if="bot.type !== 'human'">
        <show-ai-bot :bot="bot" :my-index="idx" />
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import ShowAiBot from 'src/components/Public/ShowAiBot.vue';

import { useMainRoomStore } from 'src/stores/main-room-store';

const mainRoomStore = useMainRoomStore();
</script>
