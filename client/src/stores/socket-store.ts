import { defineStore } from 'pinia';
import { ref } from 'vue';
import SocketioService from 'src/services/socket/index';

export const useSocketStore = defineStore('socketStore', () => {
  const isConnected = ref(false); // Add state for connection status
  const sentActivity = ref(false);
  const receivedActivity = ref(false);
  const timeOfBlink = 200; // TODO: change time based on the size of data

  function initializeSocket() {
    SocketioService.setupSocketConnection();
  }
  function detectedSentActivity() {
    sentActivity.value = true;
    setTimeout(() => {
      sentActivity.value = false;
    }, timeOfBlink);
  }
  function detectedReceivedActivity() {
    receivedActivity.value = true;
    setTimeout(() => {
      receivedActivity.value = false;
    }, timeOfBlink);
  }
  function connected() {
    isConnected.value = true;
  }
  function disconnected() {
    isConnected.value = false;
  }
  function emit(event: string, ...args: unknown[]) {
    detectedSentActivity();
    SocketioService.socket?.emit(event, ...args);
  }
  function volatileEmit(event: string, ...args: unknown[]) {
    detectedSentActivity();
    SocketioService.socket?.volatile.emit(event, ...args);
  }

  function resubscribeAll() {
    emit('app-init');
  }

  return {
    isConnected,
    sentActivity,
    receivedActivity,
    initializeSocket,
    detectedSentActivity,
    detectedReceivedActivity,
    connected,
    disconnected,
    emit,
    volatileEmit,
    resubscribeAll,
  };
});
