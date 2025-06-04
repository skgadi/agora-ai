import { io, type Socket } from 'socket.io-client';
import { useSocketStore } from 'src/stores/socket-store';
import { notify } from 'src/services/notifications/index';

import eventsForAdminActivities from './events/admin-activities';
import eventsForMainRoom from './events/main-room';
import eventsForNotifications from './events/notifications';

class SocketioService {
  socket: Socket | null;

  constructor() {
    this.socket = null;
  }

  setupSocketConnection(): void {
    //const isProduction = process.env.NODE_ENV === 'production';
    const socketIOPort = 3100;
    this.socket = io(`localhost:${socketIOPort}`, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      withCredentials: true,
    }); // Replace with your server URL

    this.socket.on('connect', () => {
      useSocketStore().connected();
      this.socket?.emit('full-app-init');

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
