import type {
  GSK_AI_HISTORY_TO_CLIENT,
  GSK_HUMAN_READABLE_REPORT,
} from 'src/services/library/types/data-transfer-protocls';
import { useMainRoomStore } from 'src/stores/main-room-store';

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
    default:
      return;
  }
};

export default events;
