import { app, BrowserWindow, ipcMain } from 'electron';
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

if (isDev) {
  const corsOptions = {
    origin: '*',
    methods: ['GET'],
  };
  
  server.use(cors(corsOptions));
  server.use(express.static(path.join(app.getAppPath(), './src')));
} else {
  server.use(express.static(distPath));
}

server.get(['/', '/config'], (req, res) => {
  if (isDev) {
    res.sendFile(path.join(app.getAppPath(), 'index.html'));
  } else {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

server.get('/settings', (req, res) => {
  const settings = store.store;
  res.json(settings);
});

let overlayServer;

app.whenReady().then(() => {
  overlayServer = server.listen(1412, () => {
    console.log('Settings JSON available at http://localhost:1412/settings');
  });

  const win = new BrowserWindow({
    autoHideMenuBar: true,
    minHeight: 300,
    minWidth: 500,
    height: 300,
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
