import type { GSK_SEND_SERVER_INTERNET_CONNECTIVITY } from 'src/services/library/types/data-transfer-protocls';
import { useSocketStore } from 'src/stores/socket-store';

export const events = (label: string, ...args: unknown[]) => {
  switch (label) {
    case 'socket-internet-connectivity': {
      const payloadIn: GSK_SEND_SERVER_INTERNET_CONNECTIVITY =
        args[0] as GSK_SEND_SERVER_INTERNET_CONNECTIVITY;
      const socketStore = useSocketStore();
      socketStore.setServerConnectedToInternet(payloadIn.payload.isConnected);
      return;
    }

    default:
      return;
  }
};

export default events;
