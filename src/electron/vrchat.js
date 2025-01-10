import packageJson from '../../package.json' with { type: 'json' };
import store from './store.js';
import sqlite3 from 'sqlite3';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

let lastWorldId = null;
let vrcxWorldId = null;
let vrcxAuthCookie = null;

const getVrcxPath = () => {
  return store.get('app.vrcx');
}

// Estimate the VRCX installation
const setVRCXPathFallback = () => {
  if (getVrcxPath()) return;
  const defaultPath = path.join(process.env.HOME || process.env.USERPROFILE, 'AppData', 'Roaming', 'VRCX');
  if (fs.existsSync(defaultPath)) store.set('app.vrcx', defaultPath);
}

// Query the database for the latest world id
const queryDatabaseForWorldId = (dbPath, callback) => {
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
const queryDatabaseForAuthCookie = (dbPath, callback) => {
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

// Check for world id change in the database
const fetchAndHandleVRCXData = () => {
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

// Update the stored world id and fetch new world data if needed
const handleWorldChange = ()  => {
  if (lastWorldId !== vrcxWorldId) {
    lastWorldId = vrcxWorldId;
    console.log('World changed to:', vrcxWorldId);
    fetchWorldData();
  }
}

// Fetch world data from the VRChat API
const fetchWorldData = async () => {
  if (!vrcxWorldId) return;

  const url = `https://api.vrchat.cloud/api/1/worlds/${vrcxWorldId}`;

  const headers = { 'User-Agent': `VRC OBS World Overlay/${packageJson.version} adeleine1412@gmail.com (https://github.com/philippgitpush/vrc-obs-world-overlay)` };
  if (vrcxAuthCookie) headers['Cookie'] = `auth=${vrcxAuthCookie}`;

  try {
    const response = await axios.get(url, { headers });
    store.set('overlay.world_data', response.data);

    console.log(`Fetched world data for: "${response.data.name}" by "${response.data.authorName}"`);
  } catch (error) {
    console.error('Error fetching world data:', error.message);
  }
}

const initialize = () => {
  setVRCXPathFallback();

  setInterval(() => {
    fetchAndHandleVRCXData();
  }, 3000);
}

initialize();
