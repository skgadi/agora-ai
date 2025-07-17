import axios from 'axios';
import { useSettingsStore } from 'src/stores/settings-store';

interface ServerConfig {
  socketServerUrl: string;
}

export const getSocketConfig = async () => {
  const response = await axios.get<ServerConfig>('/api/config');
  const settingsStore = useSettingsStore();
  if (!response.data || !response.data.socketServerUrl) {
    console.error('Socket server URL is not defined in the server configuration.');
    return;
  }
  settingsStore.setSocketServerUrl(response.data.socketServerUrl);
};
