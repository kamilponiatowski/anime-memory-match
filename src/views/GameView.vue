<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import GameBoard from '@/components/organisms/GameBoard.vue'
import ScoreBoard from '@/components/molecules/ScoreBoard.vue'
import AudioControls from '@/components/molecules/AudioControls.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { useGame } from '@/composables/useGame'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const { handleCardClick, isChecking, restartGame } = useGame()
const gameStore = useGameStore()
const { isGameFinished, matchedPairs, totalPairs } = storeToRefs(gameStore)

watch(isGameFinished, (finished) => {
  if (finished) {
    setTimeout(() => router.push({ name: 'result' }), 1400)
  }
})

function goHome() {
  restartGame()
  router.push({ name: 'home' })
}
</script>

<template>
  <main class="relative min-h-screen flex flex-col p-2 sm:p-4 overflow-hidden z-10" id="main-content">
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="game-blob"></div>
    </div>

    <div class="relative z-10 flex flex-col gap-2 sm:gap-3 w-full max-w-5xl mx-auto">

      <!-- Top bar -->
      <div class="flex items-center justify-between gap-2">
        <!-- Back button -->
        <BaseButton variant="ghost" size="sm" aria-label="Wróć do menu" @click="goHome">
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
</style>
