import type {
  GSK_AI_FULL_EVENT_DATA_TO_CLIENT,
  GSK_AI_TEXT_TO_SPEAK,
  GSK_REQUEST_AI_TO_START_TALKING,
  GSK_REQUEST_AI_TO_STOP_TALKING,
} from 'src/services/library/types/data-transfer-protocls';
import { useMainRoomStore } from 'src/stores/main-room-store';
import { useSpeechStore } from 'src/stores/speech-store';

export const events = (label: string, ...args: unknown[]) => {
  const mainRoomStore = useMainRoomStore();
  const speechStore = useSpeechStore();
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
    default:
      return;
  }
};

export default events;
