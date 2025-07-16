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
  <div class="row q-gutter-md">
    <div class="col">
      <q-btn
        class="q-ma-md full-width"
        label="Send"
        color="primary"
        rounded
        @click="sendChatMessage"
      />
    </div>
    <div class="col">
      <q-btn
        class="q-ma-md full-width"
        label="Clear Input"
        color="negative"
        rounded
        @click="message = ''"
      />
    </div>
    <div class="col">
      <q-btn
        class="q-ma-md full-width"
        label="Reset Chat"
        color="secondary"
        rounded
        @click="chatsStore.resetChatHistoryAtServer()"
      />
    </div>
  </div>
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
