import { app, session, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import store from './store.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import './vrchat.js';
import { inspect } from 'util';
import { config } from 'process';

const distPath = path.join(app.getAppPath(), './dist');
const isDev = !app.isPackaged;
const server = express();
const appPort = isDev ? 3000 : 1412;

// CORS: Block all non-local requests
server.use(cors({
  origin: (origin, callback) => {
    if (origin !== `http://localhost:${appPort}` && origin) return callback('Blocked request from invalid origin', false);
    callback(null, true);
  },
  methods: ['GET'],
}));

// Switch between vite and express path/port depending on environment
server.use(express.static(isDev ? path.join(app.getAppPath(), './src') : distPath));
store.set('app.port', appPort);

// Overlay and config route
server.get(['/', '/config', '/dashboard'], (req, res) => {
  if (isDev) {
    res.sendFile(path.join(app.getAppPath(), 'index.html'));
  } else {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

// Electron store route
server.get('/settings', (req, res) => {
  const settings = {
    overlay: {
      placement: store.get('overlay.placement'),
      template: store.get('overlay.template'),
      live_mode: store.get('overlay.live_mode'),
      platforms: {
        style: store.get('overlay.platforms.style'),
        include_ios: store.get('overlay.platforms.include_ios'),
      },
      world_data: store.get('overlay.world_data')
    },
    app: {
      port: store.get('app.port'),
      vrcx: store.get('app.vrcx')
    },
  };

  res.json(settings);
});

let overlayServer;
let config_window;

app.whenReady().then(() => {
  overlayServer = server.listen(1412, () => {
    console.log(`Settings JSON available at http://localhost:1412/settings`);
  });

  const dashboard_window = new BrowserWindow({
    autoHideMenuBar: true,
    minHeight: 470,
    minWidth: 400,
    height: 470,
    width: 400,
    webPreferences: {
      preload: path.join(app.getAppPath(), './src/electron/preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      preferences: {
        autofill: false
      }
    },
  });

  dashboard_window.loadURL(`http://localhost:${appPort}/dashboard`);

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    if (!details.requestHeaders['Origin']) details.requestHeaders['Origin'] = `http://localhost:${appPort}`;
    callback({ requestHeaders: details.requestHeaders });
  });
});

// Stop the server when the app is closed
app.on('window-all-closed', () => {
  if (overlayServer) overlayServer.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Listen for IPC messages to handle config operations
ipcMain.handle('get-config', (event, key) => { return store.get(key) });
ipcMain.handle('set-config', (event, key, value) => { store.set(key, value) });
ipcMain.handle('delete-config', (event, key) => { store.delete(key) });
ipcMain.handle('open-external-url', (event, url) => { shell.openExternal(url) })
ipcMain.handle('open-config-window', (event) => {
  if (!config_window) {
    config_window = new BrowserWindow({
      autoHideMenuBar: true,
      minHeight: 400,
      minWidth: 600,
      height: 720,
      width: 1100,
      webPreferences: {
        preload: path.join(app.getAppPath(), './src/electron/preload.js'),
        contextIsolation: true,
        enableRemoteModule: false,
        preferences: {
          autofill: false
        }
      },
    });
  
    config_window.loadURL(`http://localhost:${appPort}/config`)
    config_window.on("closed", () => config_window = null);
  } else {
    config_window.focus();
  }
})
ipcMain.handle('open-directory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
})
