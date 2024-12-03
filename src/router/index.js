import { createRouter, createWebHistory } from 'vue-router';
import OverlayView from '../views/OverlayView.vue';
import ConfigView from '../views/ConfigView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overlay',
      component: OverlayView
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView
    },
  ],
})

export default router
