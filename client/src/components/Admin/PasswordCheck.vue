<template>
  <template v-if="passwordCheck">
    <slot />
  </template>
  <template v-else>
    <div class="row items-center justify-evenly" style="height: 100vh">
      <div style="min-width: 300px">
        <q-input
          v-model="password"
          type="password"
          outlined
          rounded
          autofocus
          label="Password to show the admin page"
          class="q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSettingsStore } from 'src/stores/settings-store';

const password = ref('');
const settingsStore = useSettingsStore();
const passwordCheck = ref(false);

watch(
  password,
  (newPassword) => {
    if (newPassword === settingsStore.password) {
      passwordCheck.value = true;
    } else {
      passwordCheck.value = false;
    }
  },
  { immediate: true },
);
</script>
