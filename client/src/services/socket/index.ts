import { io, type Socket } from 'socket.io-client';
import { useSocketStore } from 'src/stores/socket-store';
import { notify } from 'src/services/notifications/index';
import { useSettingsStore } from 'src/stores/settings-store';

import eventsForAdminActivities from './events/admin-activities';
import eventsForMainRoom from './events/main-room';
import eventsForNotifications from './events/notifications';
import eventsForSettings from './events/settings';
import eventsForSocket from './events/socket';
import { getSocketConfig } from './get-socket-config';

class SocketioService {
  socket: Socket | null;

  constructor() {
    this.socket = null;
  }

  async setupSocketConnection() {
    //const isProduction = process.env.NODE_ENV === 'production';
    await getSocketConfig();
    const settingsStore = useSettingsStore();
    this.socket = io(settingsStore.socketServerUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      withCredentials: true,
    }); // Replace with your server URL

    this.socket.on('connect', () => {
      useSocketStore().connected();
      useSocketStore().resubscribeAll();

      notify('Conexión exitosa', 'Socket', 'positive');
    });

    this.socket.on('disconnect', () => {
      useSocketStore().disconnected();

      notify('Servidor desconectado', 'Socket', 'negative');
    });

    this.socket.onAny((label, ...args) => {
      //console.log(label, args);
      useSocketStore().detectedReceivedActivity();
      eventsForAdminActivities(label, ...args);
      eventsForMainRoom(label, ...args);
      eventsForNotifications(label, ...args);
      eventsForSettings(label, ...args);
      eventsForSocket(label, ...args);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  /*emit(event: string, data: unknown): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }*/

  // Add more methods as needed for your application
}

export default new SocketioService();
