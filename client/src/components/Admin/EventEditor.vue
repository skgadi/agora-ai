<template>
  <q-input
    v-model="event.name"
    type="text"
    outlined
    rounded
    :disable="!editable"
    label="Event Name"
  >
    <q-tooltip
      v-if="event.name"
      anchor="top middle"
      self="bottom middle"
      :delay="100"
      :transition-show="'jump-down'"
      :transition-hide="'jump-up'"
      max-width="300px"
      >{{ event.name }}</q-tooltip
    >
  </q-input>
  <q-input
    v-model="event.description"
    type="textarea"
    outlined
    rounded
    :disable="!editable"
    label="Event Description"
  >
    <q-tooltip
      v-if="event.description"
      anchor="top middle"
      self="bottom middle"
      :delay="100"
      :transition-show="'jump-down'"
      :transition-hide="'jump-up'"
      max-width="300px"
      >{{ event.description }}</q-tooltip
    >
  </q-input>
  <q-input
    v-model="event.dynamics"
    type="textarea"
    outlined
    rounded
    :disable="!editable"
    label="Event Dynamics"
  >
    <q-tooltip
      v-if="event.dynamics"
      anchor="top middle"
      self="bottom middle"
      :delay="100"
      :transition-show="'jump-down'"
      :transition-hide="'jump-up'"
      max-width="300px"
      >{{ event.dynamics }}</q-tooltip
    >
  </q-input>
</template>
<script setup lang="ts">
const event = defineModel<GSK_EVENT>({
  required: true,
});

defineProps({
  editable: {
    type: Boolean,
    default: true,
  },
});

import { type GSK_EVENT } from 'src/services/library/types/participants';
</script>
