<template>
  <img :src="appLogo" class="watermark-logo" alt="Watermark Logo" />
</template>
<script setup lang="ts">
import appLogo from 'src/assets/app-logo.png';
</script>
<style scoped lang="scss">
.watermark-logo {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 100px; /* adjust size as needed */
  opacity: 0.075; /* makes it look like a watermark */
  z-index: 9999; /* ensures it's on top of everything */
  pointer-events: none; /* so it doesn’t interfere with clicking other elements */
}
</style>
