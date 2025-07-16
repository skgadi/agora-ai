import { defineStore, acceptHMRUpdate } from 'pinia';
import type { GSK_CHAT_MESSAGE } from 'src/services/library/types/ai-data-model';
import type { GSK_SEND_USER_CHAT_TO_SERVER } from 'src/services/library/types/data-transfer-protocls';
import { useSocketStore } from 'src/stores/socket-store';

export const useChatsStore = defineStore('chats', {
  state: () => ({
    lastSentMessage: '' as string,
    conversationHistory: [] as GSK_CHAT_MESSAGE[],
  }),

  getters: {},

  actions: {
    sendMessageToServer(chatMessage: string) {
      if (chatMessage.trim() === '') {
        return;
      }
      const socketStore = useSocketStore();
      const payload: GSK_SEND_USER_CHAT_TO_SERVER = {
        type: 'GSK_SEND_USER_CHAT_TO_SERVER',
        payload: {
          chatMessage,
        },
      };
      socketStore.emit('admin-activities-send-user-chat-message-to-server', payload);
      this.lastSentMessage = chatMessage;
    },
    updateMessageHistory(messageHistory: GSK_CHAT_MESSAGE[]) {
      this.conversationHistory = messageHistory;
      this.lastSentMessage = '';
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatsStore, import.meta.hot));
}
