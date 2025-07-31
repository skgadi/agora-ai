<template>
  <q-item clickable v-ripple @click="importFromServer">
    <q-item-section avatar>
      <q-icon color="negative" name="mdi-cloud-refresh-outline" />
    </q-item-section>
    <q-item-section>Reset event data</q-item-section>
  </q-item>
</template>
<script lang="ts" setup>
const fullEventData = defineModel<GSK_FULL_EVENT_DATA>({
  required: true,
});

import type { GSK_FULL_EVENT_DATA } from 'src/services/library/types/participants';
import { useMainRoomStore } from 'src/stores/main-room-store';

const mainRoomStore = useMainRoomStore();

const importFromServer = () => {
  if (mainRoomStore.fullEventData === null) {
    // Show an error message if the data is not available
    alert('No event data available on the server.');
    return;
  }
  const eventNameOnServer = mainRoomStore?.fullEventData?.event?.name || '';
  // confirm if the user wants to import the data from the server
  const confirmImport = confirm(
    `Are you sure you want to import the event data from the server? This will overwrite your current data. Event name on server: ${eventNameOnServer}`,
  );
  if (confirmImport) {
    // Emit the event to the parent component
    fullEventData.value = mainRoomStore.fullEventData;
  }
};
</script>
