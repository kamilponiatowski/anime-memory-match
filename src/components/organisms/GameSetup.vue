<script setup lang="ts">
import AnimeSelector from '@/components/molecules/AnimeSelector.vue'
import { useAnimeStore } from '@/stores/animeStore'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import type { Difficulty } from '@/types/game.types'

const emit = defineEmits<{
  start: [difficulty: Difficulty]
}>()

const animeStore = useAnimeStore()
const gameStore = useGameStore()
const { difficulty } = storeToRefs(gameStore)

const difficulties: Array<{ value: Difficulty; label: string; hint: string }> = [
  { value: 'easy', label: 'Łatwy', hint: '6 par · 4 kol.' },
  { value: 'medium', label: 'Średni', hint: '8 par · 4 kol.' },
  { value: 'hard', label: 'Trudny', hint: '12 par · 6 kol.' },
]
</script>

<template>
  <section class="space-y-7 max-w-lg mx-auto" aria-labelledby="setup-heading">
    <h2 id="setup-heading" class="text-2xl font-bold text-slate-100">Wybierz Se!</h2>

    <!-- Wybór anime -->
    <AnimeSelector />

    <!-- Poziom trudności -->
    <fieldset>
      <legend class="text-sm font-medium text-slate-300 mb-3">Poziom trudności</legend>
      <div class="grid grid-cols-3 gap-3">
        <label
          v-for="diff in difficulties"
          :key="diff.value"
          :class="[
            'cursor-pointer rounded-xl border-2 px-3 py-3 text-center transition-all',
            difficulty === diff.value
              ? 'border-violet-500 bg-violet-500/10 text-violet-300'
              : 'border-slate-600/60 text-slate-400 hover:border-slate-500 hover:text-slate-300',
          ]"
        >
          <input v-model="gameStore.difficulty" type="radio" :value="diff.value" class="sr-only" />
          <span class="block font-semibold text-sm">{{ diff.label }}</span>
          <span class="text-xs opacity-70 mt-0.5 block">{{ diff.hint }}</span>
        </label>
      </div>
    </fieldset>

    <!-- Start gry — nowy nowoczesny przycisk -->
    <button
      class="start-btn"
      :disabled="!animeStore.hasCharacters || animeStore.isLoadingCharacters"
      :aria-busy="animeStore.isLoadingCharacters"
      :aria-disabled="!animeStore.hasCharacters || animeStore.isLoadingCharacters"
      @click="emit('start', difficulty)"
    >
      <!-- Loading spinner -->
      <span
        v-if="animeStore.isLoadingCharacters"
        class="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
        aria-hidden="true"
      />
      <!-- Play SVG icon -->
      <svg
        v-else
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-5 h-5 translate-x-0.5"
        aria-hidden="true"
      >
        <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
      </svg>
      <span>{{ animeStore.isLoadingCharacters ? 'Ładowanie postaci...' : 'Zacznij grę' }}</span>
    </button>

    <p v-if="!animeStore.selectedAnime" class="text-center text-sm text-slate-500">
      Najpierw wybierz anime powyżej
    </p>
  </section>
</template>

<style scoped>
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
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow:
    0 4px 20px rgba(139, 92, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.start-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent 60%);
  pointer-events: none;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 8px 28px rgba(139, 92, 246, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.start-btn:active:not(:disabled) {
  transform: translateY(0);
}

.start-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.start-btn:focus-visible {
  outline: 2px solid rgba(196, 181, 253, 0.9);
  outline-offset: 3px;
}
</style>

