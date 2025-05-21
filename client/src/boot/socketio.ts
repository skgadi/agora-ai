import { boot } from 'quasar/wrappers';
import SocketioService from 'src/services/socket/index';

export default boot(({ app }) => {
  //SocketioService.setupSocketConnection(); // Changed by SKGadi. We are using desktop Layout to intialized the socket connection

  // Make the socket instance available globally
  app.config.globalProperties.$socket = SocketioService.socket;
});

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $socket: typeof SocketioService.socket;
  }
}
