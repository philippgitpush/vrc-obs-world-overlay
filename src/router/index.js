import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import OverlayView from '../views/OverlayView.vue';
import ConfigView from '../views/ConfigView.vue';

const app_name = 'VRC OBS World Overlay'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overlay',
      component: OverlayView,
      meta: {
        title: 'Overlay',
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        title: 'Dashboard',
      }
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView,
      meta: {
        title: 'Settings',
      }
    },
  ],
})

router.beforeEach((to) => {
  const { title } = to.meta;
  document.title = (app_name ? title + ' – ' + app_name : app_name) || document.title
})

export default router
