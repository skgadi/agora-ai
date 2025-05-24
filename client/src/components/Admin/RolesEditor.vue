<template>
  <template v-if="roles">
    <q-markup-table bordered>
      <thead>
        <tr>
          <th>Role Name</th>
          <th>Role Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(role, index) in roles" :key="index">
          <tr>
            <td>
              <q-input
                v-model="role.name"
                type="text"
                outlined
                rounded
                label="Role Name"
                :disable="!editable"
              >
                <q-tooltip
                  v-if="role.name"
                  anchor="top middle"
                  self="bottom middle"
                  :delay="100"
                  :transition-show="'jump-down'"
                  :transition-hide="'jump-up'"
                  max-width="300px"
                  >{{ role.name }}</q-tooltip
                >
              </q-input>
            </td>
            <td>
              <q-input
                v-model="role.description"
                type="textarea"
                outlined
                rounded
                label="Role Description"
                :disable="!editable"
              >
                <q-tooltip
                  v-if="role.description"
                  anchor="top middle"
                  self="bottom middle"
                  :delay="100"
                  :transition-show="'jump-down'"
                  :transition-hide="'jump-up'"
                  max-width="300px"
                  >{{ role.description }}</q-tooltip
                >
              </q-input>
            </td>
            <td class="text-center">
              <q-btn
                class="q-mb-md"
                color="negative"
                icon="delete"
                round
                outline
                :disable="!editable"
                @click="roles.splice(index, 1)"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>
    <q-btn
      class="q-mt-md full-width"
      :disable="!editable"
      no-caps
      icon="add"
      rounded
      color="green"
      text-color="white"
      unelevated
      label="Add Role"
      @click="roles.push({ name: '', description: '' })"
    />
  </template>
</template>
<script setup lang="ts">
const roles = defineModel<GSK_ROLE[]>({
  required: true,
});

defineProps({
  editable: {
    type: Boolean,
    default: true,
  },
});

import { type GSK_ROLE } from 'src/services/library/types/participants';
</script>
