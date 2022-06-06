import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from '@/views/DashboardPage.vue'
const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardPage,
    meta: { public: true },
  },
  {
    path: '/market',
    name: 'market',
    component: DashboardPage,
    meta: { public: true},
  },
  {
    path: '/balance',
    name: 'balance',
    component: DashboardPage,
    meta: { public: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
