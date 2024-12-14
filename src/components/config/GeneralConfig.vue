<template>
  <form id="config-form" class="p-4">

    <div class="mt-2">
      <h1 class="font-bold text-xl mb-1">
        VRC OBS World Overlay
      </h1>
      <p>
        The general functionality of this app can be configured with these settings.
      </p>
    </div>

    <hr class="mt-6 mb-6">

    <div>
      <h2 class="font-bold text-lg mb-1">
        VRCX Integration
      </h2>
      <p class="mb-6">
        The overlay retrieves data from VRCX. Make sure that it is running and you are logged in.
      </p>
      <div class="mt-4 mb-4">
        <label for="input_app_vrcx" class="font-semibold text-gray-890 block mb-2">AppData Path</label>
        <div class="sm:w-full md:w-96 flex">
          <input type="text" id="input_app_vrcx" name="input_app_vrcx" class="border rounded rounded-tr-none rounded-br-none block py-2 px-3 w-full text-gray-700 focus:outline-none" placeholder="C:\Users\<User>\AppData\Roaming\VRCX">
          <div title="Choose a directory" class="border border-l-0 rounded rounded-tl-none rounded-bl-none py-2 px-3 bg-gray-100 cursor-pointer group" @click="selectDirectory()">
            <FolderSimpleIcon class="transition-opacity w-6 opacity-50 group-hover:opacity-80 duration-300" />
          </div>
        </div>
      </div>
      <button type="submit" class="py-2 px-5 rounded-xl bg-gray-900 hover:bg-gray-700 text-white transition-colors font-semibold mr-4">
        Update
      </button>
      <button v-if="app_port" type="button" class="py-2 px-5 rounded-xl bg-gray-300 hover:bg-gray-400 text-black transition-colors font-semibold" @click="copyOverlayUrl">
        Copy Overlay URL
      </button>
    </div>

  </form>
</template>

<script setup>
  import { onMounted, ref } from 'vue';

  import FolderSimpleIcon from '../icons/phosphor/regular/FolderSimple.vue';

  const app_port = ref(null);
  const input_app_vrcx = ref(null);

  function copyOverlayUrl() {
    navigator.clipboard.writeText(`http://localhost:${app_port.value}/`);
  }

  const selectDirectory = () => {
    window.electronAPI.selectDirectory().then(result => {
      if (!result) return;
      input_app_vrcx.value.value = result;
    });
  }

  onMounted(() => {
    input_app_vrcx.value = document.getElementById('input_app_vrcx');

    window.electronAPI.getConfig('app.vrcx').then((value) => {
      input_app_vrcx.value.value = value || '';
    });

    window.electronAPI.getConfig('app.port').then((value) => {
      app_port.value = value || '1412';
    });
  })
</script>
