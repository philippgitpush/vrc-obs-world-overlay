import { app, session, BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import express from 'express';
import cors from 'cors';
import path from 'path';
import './vrchat.js';

const distPath = path.join(app.getAppPath(), './dist');
const isDev = !app.isPackaged;
const store = new Store();
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
store.set('option_appPort', appPort);

// Overlay and config route
server.get(['/', '/config'], (req, res) => {
  if (isDev) {
    res.sendFile(path.join(app.getAppPath(), 'index.html'));
  } else {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

// Electron store route
server.get('/settings', (req, res) => {
  const keys = [
    'option_appPort',
    'option_liveMode',
    'data_worldInfo',
    'data_lastWorldId'
  ];

  const settings = keys.reduce((filtered, key) => {
    if (key in store.store) filtered[key] = store.store[key];
    return filtered;
  }, {});

  res.json(settings);
});

let overlayServer;

app.whenReady().then(() => {
  overlayServer = server.listen(1412, () => {
    console.log(`Settings JSON available at http://localhost:1412/settings`);
  });

  const win = new BrowserWindow({
    autoHideMenuBar: true,
    minHeight: 206,
    minWidth: 500,
    height: 206,
    width: 500,
    webPreferences: {
      preload: path.join(app.getAppPath(), './src/electron/preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      preferences: {
        autofill: false
      }
    },
  });

  win.loadURL(`http://localhost:${appPort}/config`);

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
