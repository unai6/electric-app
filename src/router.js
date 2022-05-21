import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from '@/views/DashboardPage.vue'
const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardPage,
    meta: { public: true, unauthenticatedOnly: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
