<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useAnimeStore } from '@/stores/animeStore'
import { useSound } from '@/composables/useSound'
import { anilistRepository } from '@/api/anilist/anilistRepository'
import { storeToRefs } from 'pinia'
import type { AnimePreset } from '@/types/game.types'

const router = useRouter()
const gameStore = useGameStore()
const animeStore = useAnimeStore()
const { playVictory } = useSound()
const { gameResult } = storeToRefs(gameStore)

if (!gameResult.value) {
  router.replace({ name: 'home' })
}

const stars = computed(() => {
  if (!gameResult.value) return 1
  const { accuracy, timeSeconds, totalPairs } = gameResult.value
  if (accuracy >= 80 && timeSeconds < totalPairs * 15) return 3
  if (accuracy >= 60) return 2
  return 1
})

const ratingLabel = computed(() =>
  `Ocena: ${stars.value} ${stars.value === 1 ? 'gwiazdka' : 'gwiazdki'} z 3`,
)

const resultMessage = computed(() => {
  if (stars.value === 3) return 'Znakomity wynik!'
  if (stars.value === 2) return 'Niezły wynik!'
  return 'Dasz radę następnym razem!'
})

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

// ── Top 10 anime ──────────────────────────────────────────────────────
const topAnime = ref<AnimePreset[]>([])
const isLoadingTop = ref(false)

async function loadTopAnime() {
  isLoadingTop.value = true
  try {
    topAnime.value = await anilistRepository.getTopAnime(10)
  } catch {
    topAnime.value = []
  } finally {
    isLoadingTop.value = false
  }
}

async function selectTopAnime(anime: AnimePreset) {
  gameStore.resetGame()
  await animeStore.selectAnime(anime)
  router.push({ name: 'home' })
}

function playAgain() {
  gameStore.resetGame()
  router.push({ name: 'home' })
}

function changeAnime() {
  gameStore.resetGame()
  animeStore.reset()
  router.push({ name: 'home' })
}

onMounted(() => {
  playVictory()
  loadTopAnime()
})
</script>

<template>
  <main class="relative min-h-screen flex items-start justify-center py-8 px-4 overflow-hidden z-10">
    <!-- Blobs -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="result-blob blob-a"></div>
      <div class="result-blob blob-b"></div>
    </div>

    <div class="relative z-10 max-w-md w-full flex flex-col gap-6" aria-labelledby="result-heading">

      <!-- Nagłówek — SVG trofeum -->
      <div class="text-center space-y-2" aria-live="polite">
        <div class="celebrate-icon" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 mx-auto">
            <defs>
              <linearGradient id="trophyGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#fde68a"/>
                <stop offset="60%" stop-color="#f59e0b"/>
                <stop offset="100%" stop-color="#d97706"/>
              </linearGradient>
            </defs>
            <path d="M20 8h24v20c0 8.84-7.16 16-16 16S12 36.84 12 28V8h8Z" fill="url(#trophyGrad)"/>
            <path d="M12 14H6a6 6 0 0 0 6 6" stroke="url(#trophyGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M52 14h6a6 6 0 0 1-6 6" stroke="url(#trophyGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <rect x="28" y="44" width="8" height="10" rx="2" fill="url(#trophyGrad)"/>
            <rect x="20" y="54" width="24" height="5" rx="2.5" fill="url(#trophyGrad)"/>
            <path d="M32 16l1.8 5.4h5.7l-4.6 3.4 1.8 5.4L32 27l-4.7 3.2 1.8-5.4-4.6-3.4h5.7Z" fill="white" opacity=".6"/>
          </svg>
        </div>
        <h1 id="result-heading" class="text-4xl font-extrabold text-white tracking-tight">Gra zakończona!</h1>
        <p class="text-slate-300 text-lg">{{ resultMessage }}</p>
      </div>

      <!-- Gwiazdki -->
      <div class="flex justify-center gap-3" :aria-label="ratingLabel" role="img">
        <svg
          v-for="i in 3"
          :key="i"
          viewBox="0 0 24 24"
          class="w-10 h-10 transition-all duration-500"
          :class="i <= stars ? 'star-filled' : 'star-empty'"
          :style="{ transitionDelay: `${(i - 1) * 120}ms` }"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>

      <!-- Statystyki -->
      <dl v-if="gameResult" class="glass-card divide-y divide-white/5 overflow-hidden" aria-label="Statystyki gry">
        <div class="result-row">
          <dt class="row-label">Ruchy</dt>
          <dd class="row-value">{{ gameResult.moves }}</dd>
        </div>
        <div class="result-row">
          <dt class="row-label">Czas</dt>
          <dd class="row-value">
            <time :datetime="`PT${gameResult.timeSeconds}S`">{{ formatTime(gameResult.timeSeconds) }}</time>
          </dd>
        </div>
        <div class="result-row">
          <dt class="row-label">Celność</dt>
          <dd
            class="row-value"
            :class="gameResult.accuracy >= 80 ? 'text-emerald-400' : gameResult.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'"
          >
            {{ gameResult.accuracy }}%
          </dd>
        </div>
        <div class="result-row">
          <dt class="row-label">Pary</dt>
          <dd class="row-value">{{ gameResult.totalPairs }}</dd>
        </div>
        <div v-if="animeStore.selectedAnime" class="result-row">
          <dt class="row-label">Anime</dt>
          <dd class="row-value anime-title">{{ animeStore.selectedAnime.title }}</dd>
        </div>
      </dl>

      <p v-else class="text-center text-slate-400">
        Brak danych. <button class="text-violet-400 underline" @click="playAgain">Zagraj ponownie</button>
      </p>

      <!-- Przyciski -->
      <div class="flex flex-col gap-3">
        <button class="start-btn" @click="playAgain">
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" aria-hidden="true">
            <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.46-.363Zm-7.5-7.424a5.5 5.5 0 0 1 9.201-2.466l.312.311h-2.433a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .75-.75V.589a.75.75 0 0 0-1.5 0v2.43l-.31-.31A7 7 0 0 0 6.364 5.848a.75.75 0 0 0 1.46.363Z" clip-rule="evenodd"/>
          </svg>
          <span>Zagraj jeszcze raz</span>
        </button>
        <button class="ghost-btn" @click="changeAnime">
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4" aria-hidden="true">
            <path d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7Z"/>
          </svg>
          <span>Zmień anime</span>
        </button>
      </div>

      <!-- Top 10 anime — zagraj następne -->
      <section aria-labelledby="top-anime-heading">
        <h2 id="top-anime-heading" class="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Top 10 najpopularniejszych anime — zagraj następne
        </h2>

        <!-- Skeleton ładowania -->
        <div v-if="isLoadingTop" class="grid grid-cols-2 gap-2">
          <div
            v-for="n in 10"
            :key="n"
            class="h-10 rounded-xl animate-pulse"
            style="background: rgba(255,255,255,0.05)"
          />
        </div>

        <!-- Lista top 10 -->
        <div v-else class="grid grid-cols-2 gap-2">
          <button
            v-for="(anime, idx) in topAnime"
            :key="anime.id"
            class="top-anime-btn"
            :title="anime.title"
            @click="selectTopAnime(anime)"
          >
            <span class="top-rank">{{ idx + 1 }}</span>
            <span class="top-title truncate">{{ anime.title }}</span>
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@reference "tailwindcss";

.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.result-row {
  @apply flex justify-between items-center px-6 py-4;
}
.row-label {
  @apply font-medium text-slate-400 text-sm uppercase tracking-wide;
}
.row-value {
  @apply font-bold text-slate-100 text-lg;
}

.anime-title {
  background: linear-gradient(135deg, #c4b5fd, #f0abfc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.star-filled {
  color: #fbbf24;
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6));
  transform: scale(1.1);
}
.star-empty { color: rgba(255, 255, 255, 0.15); }

.celebrate-icon {
  display: block;
  animation: celebratePop 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes celebratePop {
  from { transform: scale(0) rotate(-15deg); opacity: 0; }
  to   { transform: scale(1) rotate(0deg);   opacity: 1; }
}

/* Przyciski akcji */
.start-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #fff;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #db2777 100%);
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.15);
}
.start-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent 60%);
  pointer-events: none;
}
.start-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(139,92,246,0.55), inset 0 1px 0 rgba(255,255,255,0.18); }
.start-btn:active { transform: translateY(0); }
.start-btn:focus-visible { outline: 2px solid rgba(196,181,253,0.9); outline-offset: 3px; }

.ghost-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.9);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.ghost-btn:hover { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.2); }
.ghost-btn:focus-visible { outline: 2px solid rgba(196,181,253,0.8); outline-offset: 3px; }

/* Top anime przyciski */
.top-anime-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;
  text-align: left;
  min-width: 0;
}
.top-anime-btn:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
  transform: translateY(-1px);
}
.top-anime-btn:focus-visible { outline: 2px solid rgba(196,181,253,0.8); outline-offset: 2px; }

.top-rank {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
}
.top-title {
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(203, 213, 225, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Ambient blobs */
.result-blob { position: absolute; border-radius: 50%; filter: blur(80px); }
.blob-a { width: 450px; height: 350px; background: oklch(58% 0.22 290); opacity: .2; top: -100px; right: -80px; }
.blob-b { width: 380px; height: 300px; background: oklch(62% 0.2 340); opacity: .18; bottom: -80px; left: -60px; }

@media (prefers-reduced-motion: reduce) {
  .celebrate-icon { animation: none; }
  .star-filled, .star-empty { transition: none; }
}
</style>
