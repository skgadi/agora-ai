<template>
  <chat-show-conversation />
  <div style="width: 100%; max-width: 800px; margin: auto" class="q-pa-md">
    <q-input
      v-model="message"
      class="q-ma-md"
      label="Type your message. Press Ctrl+Enter to send. Press Ctrl+Space to clear."
      outlined
      rounded
      type="textarea"
      rows="5"
      @keyup.ctrl.enter="sendChatMessage"
      @keyup.ctrl.space="clearWithConfirmation"
      :autofocus="true"
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
          color="secondary"
          rounded
          @click="message = ''"
        />
      </div>
      <div class="col">
        <q-btn
          class="q-ma-md full-width"
          label="Reset Chat"
          color="negative"
          rounded
          @click="chatsStore.resetChatHistoryAtServer()"
        />
      </div>
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

const clearWithConfirmation = () => {
  if (confirm('Are you sure you want to clear the chat?')) {
    message.value = '';
  }
};
</script>
