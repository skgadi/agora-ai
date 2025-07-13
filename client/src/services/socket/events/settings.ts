import type { GSK_SEND_PASSWORD_TO_CLIENT } from 'src/services/library/types/data-transfer-protocls';
import { useSettingsStore } from 'src/stores/settings-store';

export const events = (label: string, ...args: unknown[]) => {
  switch (label) {
    case 'settings-admin-password': {
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
