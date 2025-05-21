<template>
  <password-check>
    <q-page class="row items-center justify-evenly">
      <div style="min-width: 300px">
        <q-input
          v-model="conferenceLang"
          type="text"
          outlined
          rounded
          :disable="!isEditing"
          label="Conference Language"
          class="q-mb-md"
        />
        <q-input
          v-model="talkTopic"
          type="text"
          outlined
          rounded
          :disable="!isEditing"
          label="Talk Topic"
          class="q-mb-md"
        />
        <q-input
          v-model="talkDescription"
          type="textarea"
          outlined
          rounded
          :disable="!isEditing"
          label="Talk Description"
          class="q-mb-md"
        />
        <q-input
          v-model="aiRole"
          type="text"
          outlined
          rounded
          label="AI Role"
          :disable="!isEditing"
          class="q-mb-md"
        />
        <q-input
          v-model="aiDescription"
          type="textarea"
          outlined
          rounded
          :disable="!isEditing"
          label="AI Description"
          class="q-mb-md"
        />
        <q-btn
          :label="isEditing ? 'Send data to AI' : 'Edit data'"
          :icon="isEditing ? 'send' : 'edit'"
          rounded
          outline
          no-caps
          color="primary"
          class="q-mt-md full-width"
          @click="sendDataToAI"
        />
      </div>
      <div>
        <participants-editor v-model="participants" :editable="isEditing" />
      </div>
    </q-page>
  </password-check>
</template>
<script setup lang="ts">
import PasswordCheck from 'src/components/Admin/PasswordCheck.vue';
import ParticipantsEditor from 'src/components/Admin/ParticipantsEditor.vue';

import { type GSK_PARTICIPANT } from 'src/services/library/types/participants';
import { ref } from 'vue';
import { useSocketStore } from 'src/stores/socket-store';
import type { GSK_SETTINGS_TO_INIT_AI } from 'src/services/library/types/data-transfer-protocls';

const socketStore = useSocketStore();

const participants = ref<GSK_PARTICIPANT[]>([]);

const talkTopic = ref('GSK AI Conference 2023');
const talkDescription = ref(
  'Join us for an exciting conference on the latest advancements in AI technology at GSK. Our expert speakers will share insights and knowledge on various AI applications in the pharmaceutical industry.',
);
const aiRole = ref('Panelist');
const aiDescription = ref(
  'As a panelist, you will engage in discussions and share your expertise on AI applications in the pharmaceutical industry. You will have the opportunity to interact with other experts and contribute to the advancement of AI technology at GSK.',
);
const conferenceLang = ref('es-MX');

const isEditing = ref(true);

const sendDataToAI = () => {
  if (!isEditing.value) {
    isEditing.value = true;
    return;
  }
  isEditing.value = false;

  // Logic to send data to AI
  const dataToSend: GSK_SETTINGS_TO_INIT_AI = {
    type: 'GSK_SETTINGS_TO_INIT_AI',
    payload: {
      settings: {
        language: conferenceLang.value,
        talkTopic: talkTopic.value,
        talkDescription: talkDescription.value,
        aiRole: aiRole.value,
        aiDescription: aiDescription.value,
        participants: participants.value,
      },
    },
  };
  socketStore.emit('admin-activities-init-ai', dataToSend);
};
</script>
