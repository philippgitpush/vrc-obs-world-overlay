import packageJson from '../../package.json' with { type: 'json' };
import Store from 'electron-store';

const store = new Store({
  defaults: {
    overlay: {
      placement: 'bottom-left',
      template: 'default',
      live_mode: false,
      platforms: {
        style: 'default',
        include_ios: true
      },
      world_data: null
    },
    app: {
      port: null,
      vrcx: null,
      config: 1
    }
  }
});

// Temporary shema adjustments, this will get its own logic in the future if necessary

if (store.get('option_vrcxPath')) { // move vrcx path (ver 1.0.0-1.0.4 -> current)
  store.get('app.vrcx', store.get('option_vrcxPath'));
  store.delete('option_vrcxPath');
}

if (store.get('data_worldInfo')) { // move world data cache (ver 1.0.0-1.0.4 -> current)
  store.set('overlay.world_data', store.get('data_worldInfo'));
  store.delete('data_worldInfo');
}

// remove misc (1.0.0-1.0.4)
store.delete('option_overlayPlacement');
store.delete('option_liveMode');
store.delete('option_appPort');
store.delete('config.version');

export default store;
