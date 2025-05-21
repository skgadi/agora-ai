import { useMainRoomStore } from 'src/stores/main-room-store';

export const events = (label: string, ...args: unknown[]) => {
  const mainRoomStore = useMainRoomStore();
  switch (label) {
    case 'main-room-text-to-talk': {
      const textToTalk = args[0] as string;
      mainRoomStore.addTextToTalk(textToTalk);
      return;
    }
    default:
      return;
  }
};

export default events;
