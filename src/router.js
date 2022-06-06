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
    component: () => import('@/views/MarketPage.vue'),
    meta: { public: true},
  },
  {
    path: '/balance',
    name: 'balance',
    component: import('@/views/BalancePage.vue'),
    meta: { public: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
