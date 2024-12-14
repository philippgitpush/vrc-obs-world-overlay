<template>
  <div class="min-h-screen flex flex-col justify-center">
    <div class="flex justify-center gap-4 flex-wrap">
      <button class="bg-gray-200 py-2 px-3 rounded hover:bg-gray-300 font-bold w-fit" @click="openConfigWindow">
        Open Settings
      </button>
      <button class="bg-gray-200 py-2 px-3 rounded hover:bg-gray-300 font-bold w-fit" @click="openExternalUrl">
        Open Overlay URL
      </button>
      <button class="bg-gray-800 py-2 px-3 rounded hover:bg-gray-900 text-white font-bold w-fit" @click="copyOverlayUrl">
        Copy Overlay URL
      </button>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';

  const app_port = ref(null);

  const openConfigWindow = () => window.electronAPI.openConfigWindow();
  const copyOverlayUrl = () => navigator.clipboard.writeText(`http://localhost:${app_port.value}/`);
  const openExternalUrl = (url) => window.electronAPI.openExternalUrl(`http://localhost:${app_port.value}/`);

  onMounted(() => {
    window.electronAPI.getConfig('app.port').then((value) => {
      app_port.value = value || '1412';
    });
  })
</script>
