<template>
  <form id="config-form" class="container mx-auto p-4">

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3 mb-2">
        <label for="option_authCookie" class="uppercase font-semibold text-gray-600">Auth Cookie</label>
      </div>
      <div class="md:w-2/3">
        <input type="password" id="option_authCookie" name="option_authCookie" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="authcookie_f1a2b9c4 ...">
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3 mb-2">
        <label for="option_vrcxPath" class="uppercase font-semibold text-gray-600">VRCX AppData Path</label>
      </div>
      <div class="md:w-2/3">
        <input type="text" id="option_vrcxPath" name="option_vrcxPath" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="C:\Users\<User>\AppData\Roaming\VRCX">
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label class="hidden" for="option_liveMode">Live mode:</label>
      </div>
      <div class="md:w-2/3">
        <input class="hidden" type="checkbox" id="option_liveMode" name="option_liveMode">
      </div>
    </div>

    <div class="md:flex md:items-center">
      <div class="md:w-1/3"></div>
      <div class="md:w-2/3 flex">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-auto">
          Save
        </button>
        <button type="submit" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mr-2" @click="openOverlayUrl">
          Preview Overlay
        </button>
        <button type="button" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full" @click="copyOverlayUrl">
          Copy Overlay URL
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
  import { onMounted } from 'vue';

  const overlayUrl = 'http://localhost:1412/';

  function copyOverlayUrl() {
    const input = document.createElement('input');
    input.value = overlayUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

  function openOverlayUrl() {
    window.open(overlayUrl, '_blank');
  }

  onMounted(() => {
    const authCookieInput = document.getElementById('option_authCookie');
    const vrcxPathInput = document.getElementById('option_vrcxPath');
    const liveModeInput = document.getElementById('option_liveMode');
    const form = document.getElementById('config-form');

    // Load saved config on startup
    window.electronAPI.getConfig('option_authCookie').then((value) => {
      authCookieInput.value = value || '';
    });
    window.electronAPI.getConfig('option_vrcxPath').then((value) => {
      vrcxPathInput.value = value || '';
    });
    window.electronAPI.getConfig('option_liveMode').then((value) => {
      liveModeInput.checked = value || false;
    });

    // Handle form submission
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const option_authCookie = authCookieInput.value;
      const option_liveMode = liveModeInput.checked;
      const option_vrcxPath = vrcxPathInput.value;

      // Save values to config
      window.electronAPI.setConfig('option_authCookie', option_authCookie);
      window.electronAPI.setConfig('option_vrcxPath', option_vrcxPath);
      window.electronAPI.setConfig('option_liveMode', option_liveMode);
    });
  })
</script>
