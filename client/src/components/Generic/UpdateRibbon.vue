<template>
  <q-dialog
    :model-value="isUpdateAvailable"
    @update:model-value="handleDialogUpdate"
    seamless
    position="top"
  >
    <q-card style="width: 300px">
      <q-linear-progress
        :indeterminate="!appUpdateStore.isUpdateFinished"
        :value="100"
        :color="!appUpdateStore.isUpdateFinished ? 'warning' : 'positive'"
      />
      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="text-weight-bold">A new update is available!</div>
          <div class="text-grey" v-if="appUpdateStore.isUpdateFinished">Installation finished.</div>
          <div class="text-grey" v-else>Installing now.</div>
        </div>
        <q-space />
        <q-btn
          flat
          round
          icon="refresh"
          :disable="!appUpdateStore.isUpdateFinished"
          :color="!appUpdateStore.isUpdateFinished ? 'grey' : 'positive'"
          @click="refreshApp"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
  <template v-if="appUpdateStore.isUpdateAvailable">
    <q-banner v-if="isUpdateAvailable" rounded class="bg-primary text-white q-py-sm q-mt-md">
      <span>A new update is available! </span>
      <span v-if="appUpdateStore.isUpdateFinished">
        Installation finished. <q-btn label="refresh" icon="refresh" @click="refreshApp" />
      </span>
      <span v-else>
        Installing now, please wait a moment &nbsp;
        <q-spinner-dots color="white" size="2em" />
      </span>
    </q-banner>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useAppUpdateStore } from 'src/stores/app-update';

const appUpdateStore = useAppUpdateStore();

const isUpdateAvailable = computed(() => {
  return appUpdateStore.isUpdateAvailable || appUpdateStore.isUpdateFinished;
});

const refreshApp = () => {
  window.location.reload();
};

const handleDialogUpdate = () => {
  // Do nothing to prevent store mutation
};
</script>
