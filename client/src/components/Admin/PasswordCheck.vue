<template>
  <template v-if="passwordCheck">
    <slot />
  </template>
  <template v-else>
    <q-page class="row items-center justify-evenly">
      <div style="min-width: 300px">
        <q-input
          v-model="password"
          type="password"
          outlined
          rounded
          label="Password to show the admin page"
          class="q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
      </div>
    </q-page>
  </template>
</template>

<script setup lang="ts">
import { passwordForAdminPanel } from 'src/services/library/passwords';
import { ref, watch } from 'vue';

const password = ref('');
const passwordCheck = ref(false);

watch(
  password,
  (newPassword) => {
    if (newPassword === passwordForAdminPanel) {
      passwordCheck.value = true;
    } else {
      passwordCheck.value = false;
    }
  },
  { immediate: true },
);
</script>
