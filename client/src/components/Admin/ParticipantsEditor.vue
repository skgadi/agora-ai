<template>
  <q-markup-table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Affiliation</th>
        <th>Role</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(participant, idx) in participants" :key="idx">
        <tr>
          <td>
            <q-input
              v-model="participant.name"
              type="text"
              dense
              outlined
              rounded
              :disable="editingIdx !== idx"
            />
          </td>
          <td>
            <q-input
              v-model="participant.post"
              type="text"
              dense
              outlined
              rounded
              :disable="editingIdx !== idx"
            />
          </td>
          <td>
            <q-input
              v-model="participant.role"
              type="text"
              dense
              outlined
              rounded
              :disable="editingIdx !== idx"
            />
          </td>
          <td>
            <template v-if="editable">
              <q-btn
                :icon="editingIdx === idx ? 'check' : 'edit'"
                round
                outline
                color="primary"
                class="q-mr-sm"
                @click="
                  () => {
                    if (editingIdx === idx) {
                      editingIdx = -1;
                    } else {
                      editingIdx = idx;
                    }
                  }
                "
              />
              <q-btn
                icon="delete"
                round
                outline
                color="negative"
                @click="
                  () => {
                    participants.splice(idx, 1);
                    if (editingIdx === idx) {
                      editingIdx = -1;
                    }
                  }
                "
              />
            </template>
            <template v-else>
              <q-btn
                round
                outline
                color="primary"
                @click="
                  () => {
                    if (recordingIdx === idx) {
                      recordingIdx = -1;
                    } else {
                      recordingIdx = idx;
                    }
                  }
                "
                :disable="recordingIdx > -1 && recordingIdx !== idx"
              >
                <template v-if="recordingIdx === idx">
                  <q-spinner-audio size="20px" />
                </template>
                <template v-else>
                  <q-icon name="mic_off" size="20px" />
                </template>
              </q-btn>
            </template>
          </td>
        </tr>
      </template>
    </tbody>
  </q-markup-table>
  <template v-if="editable">
    <q-btn
      icon="add"
      label="Add Participant"
      rounded
      outlined
      no-caps
      color="primary"
      class="q-mt-md full-width"
      @click="
        () => {
          participants.push({ name: '', company: '', post: '', role: '' });
          editingIdx = participants.length - 1;
        }
      "
    />
  </template>
  <template v-else>
    <q-btn
      icon="smart_toy"
      label="Let AI take over"
      rounded
      outlined
      no-caps
      color="primary"
      class="q-mt-md full-width"
      :disable="recordingIdx !== -1"
      @click="
        () => {
          console.log('AI taking over!');
        }
      "
    />
  </template>
</template>

<script setup lang="ts">
const participants = defineModel<GSK_PARTICIPANT[]>({
  required: true,
});

const props = defineProps({
  editable: {
    type: Boolean,
    default: true,
  },
});

import { type GSK_PARTICIPANT } from 'src/services/library/types/participants';
import { watch } from 'vue';
import { ref } from 'vue';

const editingIdx = ref(-1);
const recordingIdx = ref(-1);

watch(
  () => [props.editable],
  () => {
    if (!props.editable) {
      editingIdx.value = -1;
    } else {
      recordingIdx.value = -1;
    }
  },
);
</script>
