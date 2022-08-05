import { createRouter, createMemoryHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Settings from '@/views/Settings.vue';

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Home,
    },
    {
      name: 'Settings',
      path: '/settings',
      component: Settings,
    },
  ],
});

export default router;
