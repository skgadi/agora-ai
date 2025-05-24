<template>
  <div class="row wrap justify-evenly">
    <template v-for="(participant, idx) in participants" :key="idx">
      <div class="q-pa-md">
        <div class="column items-center">
          <q-avatar size="100px">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <div class="text-h6 q-mt-sm">
            {{ participant.name || 'Unnamed Participant' }}
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
          </div>
          <div class="text-subtitle2 q-mt-xs">
            {{ participant.role || 'No Role Assigned' }} ({{
              participant.type === 'human' ? 'Human' : 'AI'
            }})
          </div>
          <q-btn round outline color="primary" @click="toggleSpeaker(idx)">
            <template v-if="recordingIdx === idx">
              <q-spinner-audio size="20px" />
            </template>
            <template v-else>
              <q-icon name="mic_off" size="20px" />
            </template>
          </q-btn>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const participants = defineModel<GSK_PARTICIPANT[]>({
  required: true,
});

defineProps({
  fullEventData: {
    type: Object as () => GSK_FULL_EVENT_DATA,
    required: true,
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

import {
  type GSK_PARTICIPANT,
  type GSK_FULL_EVENT_DATA,
} from 'src/services/library/types/participants';
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import type {
  GSK_REQUEST_AI_TO_START_TALKING,
  GSK_REQUEST_AI_TO_STOP_TALKING,
  GSK_VOICE_INPUT_TO_SERVER,
} from 'src/services/library/types/data-transfer-protocls';
import { useSocketStore } from 'src/stores/socket-store';

const $q = useQuasar();
const socketStore = useSocketStore();

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

async function toggleSpeaker(idx: number) {
  if (idx < 0 || idx >= participants.value.length) {
    stopRecording();
    // if currently recording is AI, stop it from server
    requestAIToStopTalking(idx);
    // Reset recording index
    recordingIdx.value = -1;
    return;
  }
  if (recordingIdx.value === idx) {
    stopRecording();
    requestAIToStopTalking(idx);
    recordingIdx.value = -1;
    return;
  }
  if (recordingIdx.value !== idx) {
    // Stop previous recording if any
    stopRecording();
    requestAIToStopTalking(recordingIdx.value);
    recordingIdx.value = idx;
  }

  const participant = getParticipant(idx);
  if (participant.type === 'human') {
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
            const wavBlob = await convertWebmToWav(audioBlob);
            audioUrl.value = URL.createObjectURL(wavBlob);
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
    return;
  }
  requestAIToTalk(idx);
}

const requestAIToTalk = (idx: number) => {
  if (idx >= 0 && idx < participants.value.length) {
    const participant = getParticipant(idx);
    if (participant.type === 'human') {
      return;
    }
    console.log('requst AI to talk from server');
    socketStore.emit('admin-activities-start-ai-voice', {
      type: 'GSK_REQUEST_AI_TO_START_TALKING',
      payload: {
        speakerIdx: idx,
      },
    } as GSK_REQUEST_AI_TO_START_TALKING);
  }
};

const requestAIToStopTalking = (idx: number) => {
  if (idx >= 0 && idx < participants.value.length) {
    const participant = getParticipant(idx);
    if (participant.type === 'human') {
      return;
    }
    console.log('requst AI to stop talking from server');
    socketStore.emit('admin-activities-stop-ai-voice', {
      type: 'GSK_REQUEST_AI_TO_STOP_TALKING',
      payload: {
        speakerIdx: idx,
      },
    } as GSK_REQUEST_AI_TO_STOP_TALKING);
  }
};

interface GSK_SERVER_DETAILS {
  audioBlob: Blob;
  wavBlob: Blob;
  audioUrl: string;
  participantIdx: number;
}

const sendToServer = (inDetails: GSK_SERVER_DETAILS) => {
  const payload: GSK_VOICE_INPUT_TO_SERVER = {
    type: 'GSK_VOICE_INPUT_TO_SERVER',
    payload: {
      voiceBlob: inDetails.wavBlob,
      speakerIdx: inDetails.participantIdx,
    },
  };
  socketStore.emit('admin-activities-voice-input-to-server', payload);
  console.log('send to server with the following details ', inDetails);
  $q.notify({
    type: 'positive',
    message: `Audio sent to server for participant: ${getParticipantName(inDetails.participantIdx)}`,
  });
};

const getParticipantName = (idx: number) => {
  return getParticipant(idx).name;
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

async function convertWebmToWav(webmBlob: Blob): Promise<Blob> {
  const arrayBuffer = await webmBlob.arrayBuffer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const wavBuffer = audioBufferToWav(audioBuffer);
  return new Blob([wavBuffer], { type: 'audio/wav' });
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2;
  const bufferSound = new ArrayBuffer(44 + length);
  const view = new DataView(bufferSound);
  const channels = [];
  let pos = 0;
  let offset = 0;

  writeString('RIFF');
  view.setUint32(pos, 36 + length, true);
  pos += 4;
  writeString('WAVE');
  writeString('fmt ');
  view.setUint32(pos, 16, true);
  pos += 4;
  view.setUint16(pos, 1, true);
  pos += 2;
  view.setUint16(pos, numOfChan, true);
  pos += 2;
  view.setUint32(pos, buffer.sampleRate, true);
  pos += 4;
  view.setUint32(pos, buffer.sampleRate * 2 * numOfChan, true);
  pos += 4;
  view.setUint16(pos, numOfChan * 2, true);
  pos += 2;
  view.setUint16(pos, 16, true);
  pos += 2;
  writeString('data');
  view.setUint32(pos, length, true);
  pos += 4;

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < bufferSound.byteLength) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels?.[i]?.[offset] || 0));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  function writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(pos + i, str.charCodeAt(i));
    }
    pos += str.length;
  }

  return bufferSound;
}

const getParticipant = (idx: number) => {
  return (
    participants.value?.[idx] ||
    ({
      avatarIdle: '',
      avatarListening: '',
      avatarThinking: '',
      avatarTalking: '',
      name: '',
      bio: '',
      type: 'us-female',
      role: '',
    } as GSK_PARTICIPANT)
  );
};
</script>
