import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/form',
    name: 'ResumeForm',
    component: () => import('../views/ResumeForm.vue'),
  },
  {
    path: '/result/:id?',
    name: 'Result',
    component: () => import('../views/Result.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
