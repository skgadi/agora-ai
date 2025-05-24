<template>
  <q-img
    :src="imageSrcInString || 'https://cdn.quasar.dev/img/avatar.png'"
    spinner-color="white"
    :style="`max-width: ${size}; max-height: ${size}`"
    :class="isDisabled ? '' : 'cursor-pointer'"
    @click="openFileSelector"
  />

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
});

import { ref } from 'vue';

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
