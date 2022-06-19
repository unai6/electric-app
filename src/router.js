import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from '@/views/DashboardPage.vue'
import NotFoundPage from '@/views/misc/NotFoundPage.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardPage,
    meta: { public: true },
  },
  {
    path: '/',
    name: 'market',
    component: DashboardPage,
    meta: { public: true },
  },
  {
    path: '/no-encontrada',
    name: 'notFound',
    component: NotFoundPage,
    meta: { public: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'notFound' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
