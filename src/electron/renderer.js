const vrcxPathInput = document.getElementById('option_vrcxPath');
const liveModeInput = document.getElementById('option_liveMode');
const form = document.getElementById('config-form');

// Load saved config on startup
window.electronAPI.getConfig('option_vrcxPath').then((value) => {
  vrcxPathInput.value = value || '';
});
window.electronAPI.getConfig('option_liveMode').then((value) => {
  liveModeInput.checked = value || false;
});

// Handle form submission
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const option_liveMode = liveModeInput.checked;
  const option_vrcxPath = vrcxPathInput.value;

  // Save values to config
  window.electronAPI.setConfig('option_vrcxPath', option_vrcxPath);
  window.electronAPI.setConfig('option_liveMode', option_liveMode);
});
