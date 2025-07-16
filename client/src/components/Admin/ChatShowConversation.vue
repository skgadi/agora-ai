<template>
  <div class="q-pa-md row justify-center">
    <div style="width: 100%; max-width: 1200px">
      <template v-for="message in chatsStore.conversationHistory" :key="message.timestamp">
        <q-chat-message
          :name="message.who === 'user' ? 'Me' : 'AI'"
          :text="[marked(message.content)]"
          text-html
          :sent="message.who === 'user'"
          :text-color="message.who === 'user' ? 'white' : 'black'"
          :bg-color="message.who === 'user' ? 'primary' : 'amber'"
          :stamp="
            new Date(message.timestamp).toLocaleDateString([], {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
            }) +
            ' | ' +
            new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          "
        >
          <template v-slot:avatar>
            <q-avatar
              class="q-mx-sm"
              size="40px"
              font-size="25px"
              :color="message.who === 'user' ? 'primary' : 'amber'"
              :text-color="message.who === 'user' ? 'white' : 'black'"
              :icon="message.who === 'user' ? 'mdi-account-outline' : 'mdi-robot-outline'"
            />
          </template>
        </q-chat-message>
      </template>
      <template v-if="chatsStore.lastSentMessage !== ''">
        <q-chat-message
          name="Me"
          :text="[marked(chatsStore.lastSentMessage)]"
          text-html
          sent
          text-color="white"
          bg-color="primary"
          stamp="..."
        >
          <template v-slot:avatar>
            <q-avatar
              class="q-mx-sm"
              size="40px"
              font-size="25px"
              color="primary"
              text-color="white"
              icon="mdi-account-outline"
            />
          </template>
        </q-chat-message>

        <q-chat-message name="AI" text-html text-color="black" bg-color="amber">
          <q-spinner-dots size="2rem" />
          <template v-slot:avatar>
            <q-avatar
              class="q-mx-sm"
              size="40px"
              font-size="25px"
              color="amber"
              text-color="black"
              icon="mdi-robot-outline"
            />
          </template>
        </q-chat-message>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useChatsStore } from 'src/stores/chats-store';
import { marked } from 'marked';

const chatsStore = useChatsStore();
</script>
