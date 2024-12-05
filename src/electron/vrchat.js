import packageJson from '../../package.json' with { type: 'json' };
import Store from 'electron-store';
import sqlite3 from 'sqlite3';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

const store = new Store();

let lastWorldId = null;
let vrcxWorldId = null;
let vrcxAuthCookie = null;

function getVrcxPath() {
  return store.get('option_vrcxPath');
}

// Check for default VRCX installation and use it if the user hasn't set one already
function checkVrcxInstallation() {
  if (getVrcxPath()) return;
  const defaultPath = path.join(process.env.HOME || process.env.USERPROFILE, 'AppData', 'Roaming', 'VRCX');
  if (fs.existsSync(defaultPath)) store.set('option_vrcxPath', defaultPath);
}

// Query the database for the latest world id
function queryDatabaseForWorldId(dbPath, callback) {
  const db = new sqlite3.Database(path.join(dbPath, 'VRCX.sqlite3'), sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      return callback(err);
    }
  });

  const query = 'SELECT world_id FROM gamelog_location ORDER BY created_at DESC LIMIT 1';
  db.get(query, (err, row) => {
    db.close();
    if (err) return callback(err);
    callback(null, row ? row.world_id : null);
  });
}

// Query the database for the VRChat auth cookie
function queryDatabaseForAuthCookie(dbPath, callback) {
  const db = new sqlite3.Database(path.join(dbPath, 'VRCX.sqlite3'), sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      return callback(err);
    }
  });

  const query = 'SELECT value FROM cookies WHERE key = "default" LIMIT 1';
  db.get(query, (err, row) => {
    db.close();
    if (err) return callback(err);
    if (!row || !row.value) return callback('No cookie data found.', null);

    try {
      const decodedJson = Buffer.from(row.value, 'base64').toString('utf-8');
      const cookies = JSON.parse(decodedJson);
      const authCookieObj = cookies.find(cookie => cookie.Name === 'auth');

      if (authCookieObj && authCookieObj.Value) {
        return callback(null, authCookieObj.Value);
      } else {
        return callback('Auth cookie not found.', null);
      }
    } catch (decodeErr) {
      return callback('Error decoding or parsing cookie data:', decodeErr);
    }
  });
}

// Update the stored world id and fetch new world data if needed
function handleWorldChange() {
  if (lastWorldId !== vrcxWorldId) {
    lastWorldId = vrcxWorldId;
    console.log('World changed to:', vrcxWorldId);
    fetchWorldData();
  }
}

// Fetch world data from the VRChat API
async function fetchWorldData() {
  if (!vrcxWorldId) return;

  const url = `https://api.vrchat.cloud/api/1/worlds/${vrcxWorldId}`;

  const headers = { 'User-Agent': `VRC OBS World Overlay/${packageJson.version} adeleine1412@gmail.com (https://github.com/philippgitpush/vrc-obs-world-overlay)` };
  if (vrcxAuthCookie) headers['Cookie'] = `auth=${vrcxAuthCookie}`;

  try {
    const response = await axios.get(url, { headers });
    store.set('data_worldInfo', response.data);

    console.log(`Fetched world data for: "${response.data.name}" by "${response.data.authorName}"`);
  } catch (error) {
    console.error('Error fetching world data:', error.message);
  }
}

// Check for world id change in the database
function checkDatabaseForWorldId() {
  const dbPath = getVrcxPath();
  if (!dbPath) return;

  queryDatabaseForAuthCookie(dbPath, (err, authCookie) => {
    if (err) return console.error('Error querying database:', err.message);
    if (authCookie) vrcxAuthCookie = authCookie;
  });

  queryDatabaseForWorldId(dbPath, (err, worldId) => {
    if (err) return console.error('Error querying database:', err.message);
    if (worldId) vrcxWorldId = worldId;
  });

  if (vrcxWorldId) handleWorldChange();
}

function startPeriodicCheck() {
  setInterval(() => {
    checkDatabaseForWorldId();
  }, 3000);
}

function initialize() {
  checkVrcxInstallation();
  startPeriodicCheck();
}

initialize();
