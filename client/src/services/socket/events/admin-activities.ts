import type {
  GSK_AI_HISTORY_TO_CLIENT,
  GSK_HUMAN_READABLE_REPORT,
  GSK_SEND_PASSWORD_TO_CLIENT,
} from 'src/services/library/types/data-transfer-protocls';
import { useMainRoomStore } from 'src/stores/main-room-store';
import { useSettingsStore } from 'src/stores/settings-store';

export const events = (label: string, ...args: unknown[]) => {
  switch (label) {
    case 'app-init': {
      console.log('app-init', args[0]);
      return;
    }
    case 'admin-activities-structured-transcript': {
      const payloadIn: GSK_AI_HISTORY_TO_CLIENT = args[0] as GSK_AI_HISTORY_TO_CLIENT;
      const fullTranscript = payloadIn.history;

      // Download the transcript as a JSON file
      const blob = new Blob([JSON.stringify(fullTranscript, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'structured-transcript.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Structured transcript downloaded', fullTranscript);
      return;
    }
    case 'admin-activities-human-readable-report': {
      const payloadIn: GSK_HUMAN_READABLE_REPORT = args[0] as GSK_HUMAN_READABLE_REPORT;
      const mainRoomStore = useMainRoomStore();
      mainRoomStore.setHumanReadableReport(payloadIn.report);
      return;
    }
    case 'app-main-admin-password': {
      const payloadIn: GSK_SEND_PASSWORD_TO_CLIENT = args[0] as GSK_SEND_PASSWORD_TO_CLIENT;
      const settingsStore = useSettingsStore();
      settingsStore.setPassword(payloadIn.payload.password);
      return;
    }
    default:
      return;
  }
};

export default events;
