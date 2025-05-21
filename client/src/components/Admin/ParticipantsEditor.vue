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
              :disable="!editable"
            />
          </td>
          <td>
            <q-input
              v-model="participant.post"
              type="text"
              dense
              outlined
              rounded
              :disable="!editable"
            />
          </td>
          <td>
            <q-input
              v-model="participant.role"
              type="text"
              dense
              outlined
              rounded
              :disable="!editable"
            />
          </td>
          <td>
            <template v-if="editable">
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
            <template v-else>
              <q-btn round outline color="primary" @click="toggleRecording(idx)">
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
        }
      "
    />
  </template>
  <template v-else>
    <div v-if="audioUrl" class="q-mt-md">
      <audio :src="audioUrl" controls />
    </div>

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

defineProps({
  editable: {
    type: Boolean,
    default: true,
  },
});

import { type GSK_PARTICIPANT } from 'src/services/library/types/participants';
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { getWaveBlob } from 'webm-to-wav-converter';

const $q = useQuasar();

const isRecording = ref(false);
const recordingIdx = ref(-1);
const recordedIdx = ref(-1);
const audioUrl = ref<string | null>(null);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);

const stopRecording = () => {
  if (mediaRecorder.value) {
    recordedIdx.value = recordingIdx.value;
    mediaRecorder.value.stop();
    audioUrl.value = null;
    audioChunks.value = [];
    mediaRecorder.value = null;
    isRecording.value = false;
  }
};

async function toggleRecording(idx: number) {
  console.log('toggleRecording', idx);
  if (idx < 0 || idx >= participants.value.length) {
    stopRecording();
    recordingIdx.value = -1;
    return;
  }
  if (recordingIdx.value === idx) {
    stopRecording();
    recordingIdx.value = -1;
    return;
  }
  if (recordingIdx.value !== idx) {
    // Stop previous recording if any
    stopRecording();
    recordingIdx.value = idx;
  }

  if (!isRecording.value) {
    recordingIdx.value = idx;
    audioUrl.value = null;
    audioChunks.value = [];
    mediaRecorder.value = null;
    isRecording.value = false;
    // Start recording
    try {
      console.log(supportedAudioFormat.value);
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      mediaRecorder.value = new MediaRecorder(stream, { mimeType: supportedAudioFormat.value });

      // Clear previous audio chunks
      audioChunks.value = [];

      // Collect audio data
      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data);
        }
      };

      mediaRecorder.value.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks.value, { type: supportedAudioFormat.value });
          audioUrl.value = URL.createObjectURL(audioBlob);
          const wavBlob = await getWaveBlob(audioChunks.value, false);
          sendToServer({
            participantIdx: recordedIdx.value,
            wavBlob,
            audioBlob,
            audioUrl: audioUrl.value,
          });
          stream.getTracks().forEach((track) => track.stop());
        } catch (e) {
          console.log(e);
        }
      };

      mediaRecorder.value.start();
      isRecording.value = true;
      $q.notify({
        type: 'positive',
        message: `Recording started for participant: ${getParticipantName(idx)}`,
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to access microphone. Please check permissions.',
      });
      console.error('Error starting recording:', error);
    }
  } else {
    // Stop recording
    if (mediaRecorder.value) {
      mediaRecorder.value.stop();
      isRecording.value = false;
    }
  }
}

interface GSK_SERVER_DETAILS {
  audioBlob: Blob;
  wavBlob: Blob;
  audioUrl: string;
  participantIdx: number;
}

const sendToServer = (inDetails: GSK_SERVER_DETAILS) => {
  console.log('send to server with the following details ', inDetails);
  $q.notify({
    type: 'positive',
    message: `Audio sent to server for participant: ${getParticipantName(inDetails.participantIdx)}`,
  });
};

const getParticipantName = (idx: number) => {
  return `Idx: ${idx}, Name: ${participants.value?.[idx]?.name || ''}`;
};

const supportedAudioFormat = computed(() => {
  const audioTypes = [
    'audio/wav',
    'audio/mp3',
    'audio/aiff',
    'audio/aac',
    'audio/ogg',
    'audio/flac',
    'audio/webm', // Fallback
  ];

  for (const type of audioTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'audio/webm'; // Default fallback if none are supported
});
</script>
