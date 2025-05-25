<template>
  <q-img
    :src="imageSrcInString || defaultAvatar"
    spinner-color="white"
    :style="`max-width: ${size}; max-height: ${size}`"
    :class="isDisabled ? '' : 'cursor-pointer'"
    @click="openFileSelector"
  >
    <q-tooltip
      v-if="tooltip"
      anchor="top middle"
      self="bottom middle"
      :delay="100"
      :transition-show="'jump-down'"
      :transition-hide="'jump-up'"
      max-width="300px"
      :style="`max-width: ${size}; max-height: ${size}`"
      :class="isDisabled ? '' : 'cursor-pointer'"
      :content="tooltip"
    >
      {{ tooltip }}
    </q-tooltip>
  </q-img>

  <input
    type="file"
    ref="fileInput"
    accept="image/*"
    style="display: none"
    @change="handleFileSelect"
  />
</template>
<script lang="ts" setup>
const imageSrcInString = defineModel<string>({
  required: true,
});

defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '250px',
  },
  tooltip: {
    type: String,
    default: '',
  },
});

import { ref } from 'vue';
import defaultAvatar from 'assets/defualt-avatar.png'; // Correct path using @ alias

// Function to handle file selection and convert image to base64
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Convert the image to base64 string
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSrcInString.value = e.target?.result as string;
    };
    reader.onerror = () => {
      alert('Error reading the file.');
    };
    reader.readAsDataURL(file);
  }
};

// Ref for the file input element
const fileInput = ref<HTMLInputElement | null>(null);

// Function to trigger the file selector
const openFileSelector = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
</script>
