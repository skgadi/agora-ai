<template>
  <div class="q-pa-md row justify-center">
    <div style="width: 100%; max-width: 400px">
      <template v-for="message in chatsStore.conversationHistory" :key="message.timestamp">
        <q-chat-message
          :name="message.who === 'user' ? 'Me' : 'AI'"
          :avatar="message.who === 'user' ? chatHuman : chatRobot"
          :text="[marked(message.content)]"
          text-html
          :sent="message.who === 'user'"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import chatRobot from 'src/assets/chat-robot.svg';
import chatHuman from 'src/assets/chat-human.svg';
import { useChatsStore } from 'src/stores/chats-store';
import { marked } from 'marked';

const chatsStore = useChatsStore();
</script>
