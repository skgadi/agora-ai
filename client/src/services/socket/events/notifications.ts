import { type GSK_SEND_NOTIFICATION_TO_CLIENT } from 'src/services/library/types/data-transfer-protocls';
import { notify } from 'src/services/notifications/index';

export const events = (label: string, ...args: unknown[]) => {
  switch (label) {
    case 'notify-client': {
      const textToTalk = args[0] as GSK_SEND_NOTIFICATION_TO_CLIENT;
      notify(
        textToTalk.payload.message,
        textToTalk.payload.title,
        textToTalk.payload.type,
        textToTalk.payload.duration,
        textToTalk.payload.icon,
      );
      console.log('Notification sent to client:', textToTalk.payload);
      return;
    }
    default:
      return;
  }
};

export default events;
