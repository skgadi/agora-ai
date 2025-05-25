<template>
  <div class="text-center q-mb-md">
    <select-image v-model="event.background" :isDisabled="!editable" />
  </div>
  <q-select
    v-model="event.language"
    :options="optionsForLanguage"
    outlined
    rounded
    :disable="!editable"
    label="Event Language"
    emit-value
    map-options
  />
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

import SelectImage from 'src/components/Generic/SelectImage.vue';
import { getHumanReadableLangTagInSameLang } from 'src/services/library/generic/utils';

import { type GSK_EVENT } from 'src/services/library/types/participants';
import { computed } from 'vue';
import { useSpeechStore } from 'src/stores/speech-store';

const speechStore = useSpeechStore();

const optionsForLanguage = computed(() => {
  return speechStore.listAllUniqueLanguages.map((lang) => {
    return {
      label: getHumanReadableLangTagInSameLang(lang),
      value: lang,
    };
  });
});
</script>
