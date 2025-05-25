// In src/boot/pwa.ts
import { boot } from 'quasar/wrappers';
import { Workbox } from 'workbox-window';
import { useAppUpdateStore } from 'src/stores/app-update';

export default boot(async () => {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');
    const appUpdateStore = useAppUpdateStore(); // Pinia is available here

    wb.addEventListener('waiting', () => {
      appUpdateStore.setUpdateAvailable(true);
    });

    wb.addEventListener('controlling', () => {
      appUpdateStore.setUpdateFinished(true);
    });

    await wb.register();
  }
});
