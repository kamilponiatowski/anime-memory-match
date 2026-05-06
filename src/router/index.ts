import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Anime Memory Match' },
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
      meta: { title: 'Gra — Anime Memory Match', requiresGame: true },
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('@/views/ResultView.vue'),
      meta: { title: 'Wynik — Anime Memory Match', requiresResult: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '404 — Anime Memory Match' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to) => {
  document.title = (to.meta.title as string) ?? 'Anime Memory Match'

  const gameStore = useGameStore()

  if (to.meta.requiresGame && gameStore.status === 'idle') {
    return { name: 'home' }
  }

  if (to.meta.requiresResult && !gameStore.isGameFinished) {
    return { name: 'home' }
  }
})

export default router
