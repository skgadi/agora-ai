<template>
  <chat-show-conversation />
  <q-input
    v-model="message"
    class="q-ma-md"
    label="Type your message. Press Ctrl+Enter to send."
    outlined
    rounded
    type="textarea"
    rows="5"
    @keyup.ctrl.enter="sendChatMessage"
  />
</template>
<script lang="ts" setup>
import ChatShowConversation from 'src/components/Admin/ChatShowConversation.vue';

import { ref } from 'vue';
import { useChatsStore } from 'src/stores/chats-store';

const chatsStore = useChatsStore();
const message = ref('');

const sendChatMessage = () => {
  if (message.value.trim() === '') {
    return;
  }
  chatsStore.sendMessageToServer(message.value);
  message.value = ''; // Clear the input after sending
};
</script>
