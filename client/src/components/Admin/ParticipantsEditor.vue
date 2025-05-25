<template>
  <q-markup-table>
    <thead>
      <tr>
        <th>Human/AI-Voice</th>
        <th>Role</th>
        <th>Name</th>
        <th>Bio</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(participant, idx) in participants" :key="idx">
        <tr>
          <td>
            <q-select
              v-model="participant.type"
              :options="optionsForType"
              dense
              outlined
              rounded
              :disable="!editable"
              emit-value
              map-options
            />
          </td>
          <td>
            <q-select
              v-model="participant.role"
              :options="roles"
              dense
              outlined
              rounded
              :disable="!editable"
              emit-value
              map-options
            />
          </td>
          <td>
            <q-input
              v-model="participant.name"
              type="text"
              dense
              outlined
              rounded
              :disable="!editable"
            >
              <q-tooltip
                v-if="participant.name"
                anchor="top middle"
                self="bottom middle"
                :delay="100"
                :transition-show="'jump-down'"
                :transition-hide="'jump-up'"
                max-width="300px"
                >{{ participant.name }}</q-tooltip
              >
            </q-input>
          </td>
          <td>
            <q-input
              v-model="participant.bio"
              type="textarea"
              dense
              outlined
              rounded
              :disable="!editable"
            >
              <q-tooltip
                v-if="participant.bio"
                anchor="top middle"
                self="bottom middle"
                :delay="100"
                :transition-show="'jump-down'"
                :transition-hide="'jump-up'"
                max-width="300px"
                >{{ participant.bio }}</q-tooltip
              >
            </q-input>
          </td>
          <td class="text-center">
            <template v-if="editable">
              <select-image v-model="participant.avatarIdle" :is-disabled="!editable" size="50px" />
              <q-btn
                icon="delete"
                round
                outline
                color="negative"
                @click="
                  () => {
                    participants.splice(idx, 1);
                  }
                "
              />
            </template>
          </td>
        </tr>
      </template>
    </tbody>
  </q-markup-table>
  <q-btn
    icon="add"
    label="Add Participant"
    rounded
    outlined
    no-caps
    color="primary"
    class="q-mt-md full-width"
    :disable="!editable"
    @click="
      () => {
        participants.push({
          name: '',
          bio: '',
          type: 'us-female',
          role: '',
          avatarIdle: '',
          avatarTalking: '',
          avatarListening: '',
          avatarThinking: '',
        });
      }
    "
  />
</template>

<script setup lang="ts">
const participants = defineModel<GSK_PARTICIPANT[]>({
  required: true,
});

const props = defineProps({
  fullEventData: {
    type: Object as () => GSK_FULL_EVENT_DATA,
    required: true,
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

import SelectImage from 'src/components/Generic/SelectImage.vue';

import {
  type GSK_PARTICIPANT,
  type GSK_FULL_EVENT_DATA,
} from 'src/services/library/types/participants';
import { computed } from 'vue';
import { useSpeechStore } from 'src/stores/speech-store';

const speechStore = useSpeechStore();

const optionsForType = computed(() => {
  return [
    {
      label: 'Human',
      value: 'human',
    },
    ...speechStore.allVoicesOptions,
  ];
});

const roles = computed(() => {
  return props.fullEventData.roles.map((role) => ({
    label: role.name,
    value: role.name,
  }));
});
</script>
