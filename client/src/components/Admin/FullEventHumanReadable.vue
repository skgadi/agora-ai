<template>
  <q-item clickable v-ripple @click="requestHumanReadableReport">
    <q-item-section avatar>
      <q-icon color="primary" name="mdi-file-document-outline" />
    </q-item-section>
    <q-item-section>Show report</q-item-section>
  </q-item>
  <q-dialog v-model="mdDialog" full-width full-height>
    <q-card class="q-pa-md" style="max-height: 100%; max-width: 100%; overflow: hidden">
      <div style="overflow: auto; height: 100%">
        <article class="markdown-body" v-html="htmlToDisplay" />
      </div>
      <q-page-sticky position="bottom-right" :offset="[30, 30]">
        <q-btn fab icon="print" color="accent" @click="printTheReport" />
      </q-page-sticky>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useMainRoomStore } from 'src/stores/main-room-store';
import { computed, ref } from 'vue';
import { marked } from 'marked';
import 'github-markdown-css/github-markdown.css';

const mainRoomStore = useMainRoomStore();

const mdDialog = ref(false);

const requestHumanReadableReport = () => {
  mdDialog.value = true;
  mainRoomStore.requestHumanReadableReport();
};

const htmlToDisplay = computed(() => {
  return marked.parse(mainRoomStore.humanReadableReport) as string;
});

/**
 * This function will send the content of the human-readable report to another window
 * and open it in a new tab. After opening the new tab, it will prompt the user to print.
 * once printed, it should close the window.
 */

const printTheReport = () => {
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    // in the new window, we will write the HTML content
    // and the CSS styles for the markdown
    // the css content is taken from the github-markdown-css package not from the CDN
    newWindow.document.write(`
      <html>
        <head>
          <title>Human Readable Report</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.min.css">
        </head>
        <body class="markdown-body">
          ${htmlToDisplay.value}
        </body>
      </html>
    `);
    newWindow.document.close(); // Close the document to finish loading
    newWindow.focus(); // Focus on the new window
    newWindow.print(); // Trigger the print dialog
    newWindow.onafterprint = () => {
      newWindow.close(); // Close the window after printing
    };
  } else {
    console.error('Failed to open a new window for printing the report.');
  }
};
</script>
