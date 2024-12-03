import './assets/css/index.css'
/* import './assets/css/main.min.css' */

import { createApp, provide } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App)
app.use(router)
app.mount('#app')
