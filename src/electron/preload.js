const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: (key) => ipcRenderer.invoke('get-config', key),
  setConfig: (key, value) => ipcRenderer.invoke('set-config', key, value),
  deleteConfig: (key) => ipcRenderer.invoke('delete-config', key),
  openExternalUrl: (url) => ipcRenderer.invoke('open-external-url', url),
  selectDirectory: () => ipcRenderer.invoke('open-directory'),
  openConfigWindow: () => ipcRenderer.invoke('open-config-window')
});
