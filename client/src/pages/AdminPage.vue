<template>
  <password-check>
    <template v-if="isEditing">
      <q-page class="q-pa-md">
        <q-list bordered separator class="rounded-borders">
          <q-expansion-item
            expand-separator
            icon="event"
            label="Event editor"
            :caption="`Name: ${fullEventData.event.name}`"
          >
            <div class="q-pa-md">
              <event-editor v-model="fullEventData.event" :editable="isEditing" />
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            icon="category"
            label="Roles editor"
            :caption="`Total: ${fullEventData.roles.length}`"
          >
            <div class="q-pa-md">
              <roles-editor v-model="fullEventData.roles" :editable="isEditing" />
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            icon="groups"
            label="Participants editor"
            :caption="`Total: ${fullEventData.participants.length}; AI participants: ${fullEventData.participants.filter((p) => p.type !== 'human').length} `"
          >
            <div class="q-pa-md">
              <participants-editor
                v-model="fullEventData.participants"
                :editable="isEditing"
                :full-event-data="fullEventData"
              />
            </div>
          </q-expansion-item>
        </q-list>

        <q-btn
          :label="isEditing ? 'Send data to AI' : 'Edit data'"
          :icon="isEditing ? 'send' : 'edit'"
          rounded
          outline
          no-caps
          color="primary"
          class="q-mt-md full-width"
          :disable="!socketStore.isConnected"
          @click="startStopShow"
        />
      </q-page>
    </template>
    <template v-else>
      <q-page class="row items-center justify-center">
        <div class="full-width q-pa-md">
          <send-inputs-to-server
            v-model="fullEventData.participants"
            :editable="isEditing"
            :full-event-data="fullEventData"
          />
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn fab icon="close" color="negative" @click="startStopShow" />
        </q-page-sticky>
      </q-page>
    </template>
  </password-check>
</template>
<script setup lang="ts">
import PasswordCheck from 'src/components/Admin/PasswordCheck.vue';
import ParticipantsEditor from 'src/components/Admin/ParticipantsEditor.vue';
import EventEditor from 'src/components/Admin/EventEditor.vue';
import RolesEditor from 'src/components/Admin/RolesEditor.vue';
import SendInputsToServer from 'src/components/Admin/SendInputsToServer.vue';

import type { GSK_FULL_EVENT_DATA } from 'src/services/library/types/participants';
import { ref, watch } from 'vue';
import { useSocketStore } from 'src/stores/socket-store';
import type { GSK_SETTINGS_TO_INIT_AI } from 'src/services/library/types/data-transfer-protocls';
import { useSpeechStore } from 'src/stores/speech-store';

const socketStore = useSocketStore();
const speechStore = useSpeechStore();

//const participants = ref<GSK_PARTICIPANT[]>([]);
const fullEventData = ref<GSK_FULL_EVENT_DATA>({
  event: {
    background: '',
    name: 'GSK AI Conference 2023',
    description:
      'Join us for an exciting conference on the latest advancements in AI technology at GSK. Our expert speakers will share insights and knowledge on various AI applications in the pharmaceutical industry.',
    dynamics: '',
    language: 'en-US',
  },
  participants: [
    {
      type: '',
      avatarIdle: '',
      avatarListening: '',
      avatarThinking: '',
      avatarTalking: '',

      name: 'John Doe',
      bio: 'AI Expert with 10 years of experience in the pharmaceutical industry.',
      role: 'Moderator',
    },
    {
      type: '',
      avatarIdle: '',
      avatarListening: '',
      avatarThinking: '',
      avatarTalking: '',

      name: 'Jane Smith',
      bio: 'Data Scientist with a focus on AI applications in healthcare.',
      role: 'Panelist',
    },
    {
      type: 'human',
      avatarIdle: '',
      avatarListening: '',
      avatarThinking: '',
      avatarTalking: '',

      name: 'Alice Johnson',
      bio: 'Machine Learning Engineer with a passion for AI in drug discovery.',
      role: 'Panelist',
    },
  ],
  roles: [
    {
      name: 'Moderator',
      description:
        'Facilitates the discussion and ensures that all participants have a chance to speak.',
    },
    {
      name: 'Panelist',
      description:
        'Engages in discussions and shares expertise on AI applications in the pharmaceutical industry.',
    },
  ],
});

watch(
  () => speechStore.allVoicesOptions,
  () => {
    if (speechStore.allVoicesOptions.length === 0) {
      return;
    }
    let voiceIndex = 0;
    fullEventData.value.participants.forEach((participant) => {
      if (participant.type === 'human') {
        return;
      }
      participant.type =
        speechStore?.allVoicesOptions?.[voiceIndex]?.value ||
        speechStore?.allVoicesOptions?.[0]?.value ||
        '';
      voiceIndex++;
    });
  },
  { immediate: true },
);

const isEditing = ref(true);

const startStopShow = () => {
  if (!isEditing.value) {
    // confirm before stopping
    const confirmStop = confirm('Are you sure you want to stop the show?');
    if (!confirmStop) {
      return;
    }
    isEditing.value = true;
    return;
  }

  // confirm before starting
  const confirmStart = confirm('Are you sure you want to start the show?');
  if (!confirmStart) {
    return;
  }

  isEditing.value = false;

  // Logic to send data to AI
  const dataToSend: GSK_SETTINGS_TO_INIT_AI = {
    type: 'GSK_SETTINGS_TO_INIT_AI',
    fullEventData: fullEventData.value,
  };
  socketStore.emit('admin-activities-init-ai', dataToSend);
};

watch(
  () => socketStore.isConnected,
  () => {
    if (!socketStore.isConnected) {
      isEditing.value = true;
    }
  },
  { immediate: true },
);
</script>
