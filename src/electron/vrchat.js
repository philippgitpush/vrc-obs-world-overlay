import packageJson from '../../package.json' with { type: 'json' };
import Store from 'electron-store';
import sqlite3 from 'sqlite3';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

const store = new Store();

function getVrcxPath() {
  return store.get('option_vrcxPath');
}

// Query the database for the latest world ID
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

// Update the stored world ID and fetch new world data if needed
function handleWorldChange(newWorldId) {
  const lastWorldId = store.get('data_lastWorldId');

  if (lastWorldId !== newWorldId) {
    store.set('data_lastWorldId', newWorldId);
    console.log('World changed to:', newWorldId);
    fetchWorldData(newWorldId);
  }
}

// Fetch world data from the VRChat API
async function fetchWorldData(worldId) {
  const url = `https://api.vrchat.cloud/api/1/worlds/${worldId}`;
  const authCookie = store.get('option_authCookie');

  const headers = { 'User-Agent': `VRC OBS World Overlay/${packageJson.version} adeleine1412@gmail.com (https://github.com/philippgitpush/vrc-obs-world-overlay)` };
  if (authCookie) headers['Cookie'] = `auth=${authCookie}`;

  try {
    const response = await axios.get(url, { headers });
    store.set('data_worldInfo', response.data);

    console.log(`Fetched world data for: "${response.data.name}" by "${response.data.authorName}"`);
  } catch (error) {
    console.error('Error fetching world data:', error.message);
  }
}

// Check for world ID change in the database
function checkDatabaseForWorldId() {
  const dbPath = getVrcxPath();
  if (!dbPath) return;

  queryDatabaseForWorldId(dbPath, (err, worldId) => {
    if (err) return console.error('Error querying database:', err.message);
    if (worldId) handleWorldChange(worldId);
  });
}

function startPeriodicCheck() {
  setInterval(() => {
    checkDatabaseForWorldId();
  }, 3000);
}

function initialize() {
  startPeriodicCheck();
}

initialize();
