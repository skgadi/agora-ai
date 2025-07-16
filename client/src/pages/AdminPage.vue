<template>
  <password-check>
    <q-layout view="lHr lpR fFf">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn
            flat
            round
            size="lg"
            :icon="leftDrawerOpen ? 'mdi-menu-open' : 'mdi-menu'"
            @click="leftDrawerOpen = !leftDrawerOpen"
            class="q-mr-md"
          />
          <q-toolbar-title>Panelist-AI</q-toolbar-title>
          <q-space />
          <connectivity-indicator />
          <server-internet-indicator class="q-ml-md" />
          <q-btn
            flat
            round
            size="lg"
            :icon="rightDrawerOpen ? 'mdi-forum-remove-outline' : 'mdi-forum-outline'"
            @click="rightDrawerOpen = !rightDrawerOpen"
            class="q-ml-md"
          />
        </q-toolbar>
        <UpdateRibbon ref="updateRibbon" />
      </q-header>
      <q-drawer v-model="leftDrawerOpen" side="left" bordered>
        <!-- drawer content -->
        <q-list>
          <q-item clickable @click="leftDrawerOpen = false">
            <q-item-section avatar>
              <q-icon name="mdi-close" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Close menu</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <leftside-menu v-model="fullEventData" :is-editing="isEditing" />
      </q-drawer>

      <q-drawer v-model="rightDrawerOpen" side="right" :width="500" :breakpoint="500" bordered>
        <!-- drawer content -->
        <q-list>
          <q-item clickable @click="rightDrawerOpen = false">
            <q-item-section avatar>
              <q-icon name="mdi-close" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Close chat</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable @click="(showChatFullScreen = true) && (rightDrawerOpen = false)">
            <q-item-section avatar>
              <q-icon name="mdi-forum-outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Open chat in full screen</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <chat-drawer />
      </q-drawer>

      <q-page-container>
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

            <div class="row">
              <div class="col q-mr-xl">
                <q-btn
                  label="Start a new conversation"
                  icon="mdi-new-box"
                  rounded
                  outline
                  no-caps
                  color="primary"
                  class="q-mt-md full-width"
                  :disable="!socketStore.isConnected"
                  @click="startStopShow"
                />
              </div>
              <div class="col">
                <q-btn
                  label="Continue the conversation"
                  icon="mdi-play-outline"
                  rounded
                  outline
                  no-caps
                  color="primary"
                  class="q-mt-md full-width"
                  :disable="!socketStore.isConnected"
                  @click="continueConversation"
                />
              </div>
            </div>
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
      </q-page-container>
    </q-layout>
    <q-dialog v-model="showChatFullScreen" full-height full-width>
      <q-card style="width: 100%; max-width: 800px">
        <chat-drawer />
      </q-card>
    </q-dialog>
  </password-check>
</template>
<script setup lang="ts">
import ConnectivityIndicator from 'src/components/Generic/ConnectivityIndicator.vue';
import UpdateRibbon from 'components/Generic/UpdateRibbon.vue';
import LeftsideMenu from 'src/components/Admin/LeftsideMenu.vue';
import ServerInternetIndicator from 'src/components/Generic/ServerInternetIndicator.vue';
import ChatDrawer from 'src/components/Admin/ChatModule.vue';

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

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

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

const continueConversation = () => {
  // confirm before starting
  const confirmContinue = confirm(
    'Are you sure you want to continue the conversation with existing conversation history?',
  );
  if (!confirmContinue) {
    return;
  }

  isEditing.value = false;

  // Logic to send data to AI
  const dataToSend: GSK_SETTINGS_TO_INIT_AI = {
    type: 'GSK_SETTINGS_TO_INIT_AI',
    fullEventData: fullEventData.value,
  };
  socketStore.emit('admin-activities-continue-ai-with-history', dataToSend);
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

const showChatFullScreen = ref(false);
</script>
