<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import GameBoard from '@/components/organisms/GameBoard.vue'
import ScoreBoard from '@/components/molecules/ScoreBoard.vue'
import AudioControls from '@/components/molecules/AudioControls.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { useGame } from '@/composables/useGame'
import { useGameStore } from '@/stores/gameStore'
import { useAnimeStore } from '@/stores/animeStore'
import { storeToRefs } from 'pinia'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const { handleCardClick, isChecking, startGame, restartGame } = useGame()
const gameStore = useGameStore()
const animeStore = useAnimeStore()
const { isGameFinished, matchedPairs, totalPairs, difficulty } = storeToRefs(gameStore)

const isShuffling = ref(false)

watch(isGameFinished, (finished) => {
  if (finished) {
    setTimeout(() => router.push({ name: 'result' }), 1400)
  }
})

function goHome() {
  restartGame()
  router.push({ name: 'home' })
}

async function handleShuffle() {
  if (!animeStore.selectedAnime || isShuffling.value || isChecking.value) return
  isShuffling.value = true
  await animeStore.selectAnime(animeStore.selectedAnime) // re-fetch new characters
  await startGame(difficulty.value)
  isShuffling.value = false
}
</script>

<template>
  <main class="relative min-h-dvh flex flex-col items-center justify-center p-2 pb-14 sm:p-4 sm:pb-14 overflow-hidden z-10" id="main-content">
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="game-blob"></div>
    </div>

    <div class="relative z-10 flex flex-col gap-2 sm:gap-3 w-full max-w-5xl mx-auto">

      <!-- Top bar -->
      <div class="flex items-center justify-between gap-2">
        <!-- Back button -->
        <BaseButton variant="outline" size="sm" aria-label="Wróć do menu" @click="goHome">
          <ChevronLeftIcon class="w-4 h-4" />
          Menu
        </BaseButton>

        <h1 class="sr-only">Anime Memory Match — Gra</h1>

        <!-- Prawa strona: audio + scoreboard -->
        <div class="flex items-center gap-2">
          <AudioControls />
          <ScoreBoard />
        </div>
      </div>

      <!-- Progress bar -->
      <div
        class="h-1 w-full rounded-full overflow-hidden bg-white/5"
        role="progressbar"
        :aria-valuenow="matchedPairs"
        :aria-valuemax="totalPairs"
        :aria-label="`Postęp: ${matchedPairs} z ${totalPairs} par`"
      >
        <div
          class="h-full rounded-full transition-all duration-700"
          :style="{
            width: `${gameStore.progressPercent}%`,
            background: 'linear-gradient(90deg, #8b5cf6, #d946ef)',
          }"
        />
      </div>

      <!-- Board -->
      <div class="flex justify-center">
        <div class="w-full">
          <GameBoard :is-disabled="isChecking" @card-flip="handleCardClick" />
        </div>
      </div>

      <!-- Shuffle button -->
      <div class="flex justify-center pt-1">
        <button
          class="shuffle-btn"
          :disabled="isChecking || isShuffling || isGameFinished"
          :aria-busy="isShuffling"
          aria-label="Potasuj karty — pobierz nowe postacie z tego samego anime"
          @click="handleShuffle"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-4 h-4"
            :class="{ 'animate-spin': isShuffling }"
            aria-hidden="true"
          >
            <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.46-.363Zm-7.5-7.424a5.5 5.5 0 0 1 9.201-2.466l.312.311h-2.433a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .75-.75V.589a.75.75 0 0 0-1.5 0v2.43l-.31-.31A7 7 0 0 0 6.364 5.848a.75.75 0 0 0 1.46.363Z" clip-rule="evenodd"/>
          </svg>
          <span>{{ isShuffling ? 'Ładowanie nowych postaci...' : 'Potasuj karty' }}</span>
        </button>
      </div>
    </div>

    <div aria-live="assertive" aria-atomic="true" class="sr-only">
      <span v-if="isGameFinished">Gratulacje! Gra zakończona! Przechodzę do wyników.</span>
    </div>
  </main>
</template>

<style scoped>
.game-blob {
  position: absolute;
  width: 700px; height: 400px;
  background: oklch(52% 0.2 270);
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.1;
  top: -150px; left: 50%;
  transform: translateX(-50%);
}

.shuffle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #c4b5fd;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.35);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
}
.shuffle-btn:hover:not(:disabled) {
  background: rgba(139, 92, 246, 0.18);
  border-color: rgba(139, 92, 246, 0.6);
  color: #e9d5ff;
  transform: translateY(-1px);
}
.shuffle-btn:active:not(:disabled) { transform: translateY(0); }
.shuffle-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.shuffle-btn:focus-visible { outline: 2px solid rgba(196, 181, 253, 0.8); outline-offset: 3px; }
</style>
