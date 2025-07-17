import type {
  GSK_AI_FULL_EVENT_DATA_TO_CLIENT,
  GSK_AI_TEXT_TO_SPEAK,
  GSK_REQUEST_AI_TO_START_TALKING,
  GSK_REQUEST_AI_TO_STOP_TALKING,
  GSK_SEND_FULL_CHAT_HISTORY_TO_CLIENT,
  GSK_SEND_LIST_OF_USEFUL_MODELS_TO_CLIENT,
  GSK_SEND_SELECTED_MODEL,
} from 'src/services/library/types/data-transfer-protocls';
import { useMainRoomStore } from 'src/stores/main-room-store';
import { useSpeechStore } from 'src/stores/speech-store';
import { useChatsStore } from 'src/stores/chats-store';
import { useSettingsStore } from 'src/stores/settings-store';

export const events = (label: string, ...args: unknown[]) => {
  const mainRoomStore = useMainRoomStore();
  const speechStore = useSpeechStore();
  const chatsStore = useChatsStore();
  const settingsStore = useSettingsStore();
  switch (label) {
    case 'main-room-full-event-data': {
      const textToTalk = args[0] as GSK_AI_FULL_EVENT_DATA_TO_CLIENT;
      mainRoomStore.resetFullEvent(textToTalk.fullEventData);
      return;
    }
    case 'main-room-ai-response': {
      //console.log('main-room-ai-response', args);
      const textToSpeak = args[0] as GSK_AI_TEXT_TO_SPEAK;
      mainRoomStore.addTextToSpeak(textToSpeak.payload);
      return;
    }
    case 'main-room-ai-is-thinking': {
      const thinkingElement = args[0] as GSK_REQUEST_AI_TO_START_TALKING;
      mainRoomStore.setThinkingSpeakerIdx(thinkingElement.payload.speakerIdx);
      return;
    }
    case 'main-room-ai-stop-talking': {
      const speakerIdx = args[0] as GSK_REQUEST_AI_TO_STOP_TALKING;
      console.log('main-room-ai-stop-talking', speakerIdx);
      speechStore.forceStopSpeaking();
      return;
    }
    case 'main-room-chat-history': {
      const chatHistory = args[0] as GSK_SEND_FULL_CHAT_HISTORY_TO_CLIENT;
      chatsStore.updateMessageHistory(chatHistory.payload.chatHistory);
      return;
    }
    case 'main-room-list-of-useful-models': {
      const models = args[0] as GSK_SEND_LIST_OF_USEFUL_MODELS_TO_CLIENT;
      settingsStore.setAvailableAiModels(models.payload.models);
      return;
    }
    case 'main-room-selected-ai-model': {
      const model = args[0] as GSK_SEND_SELECTED_MODEL;
      settingsStore.setSelectedAiModel(model.payload.model);
      return;
    }
    default:
      return;
  }
};

export default events;
