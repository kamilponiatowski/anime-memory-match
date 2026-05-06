<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()
const { moves, matchedPairs, totalPairs, elapsedSeconds } = storeToRefs(gameStore)

const formattedTime = computed(() => {
  const m = Math.floor(elapsedSeconds.value / 60)
  const s = elapsedSeconds.value % 60
  return `${m}:${String(s).padStart(2, '0')}`
})
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    aria-label="Wynik gry"
    class="flex items-center gap-5 rounded-2xl px-5 py-2.5 scoreboard-glass"
  >
    <div class="stat">
      <span class="stat-label">Ruchy</span>
      <span class="stat-value" :aria-label="`${moves} ruchów`">{{ moves }}</span>
    </div>

    <div class="stat">
      <span class="stat-label">Pary</span>
      <span class="stat-value" :aria-label="`${matchedPairs} z ${totalPairs} par`">
        {{ matchedPairs }}<span class="text-slate-500 text-lg">/{{ totalPairs }}</span>
      </span>
    </div>

    <div class="stat">
      <span class="stat-label">Czas</span>
      <time
        class="stat-value"
        :datetime="`PT${elapsedSeconds}S`"
        :aria-label="`Czas: ${formattedTime}`"
      >
        {{ formattedTime }}
      </time>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.scoreboard-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.stat {
  @apply flex flex-col items-center;
}
.stat-label {
  @apply text-xs font-medium uppercase tracking-widest text-slate-400;
}
.stat-value {
  @apply text-2xl font-bold text-slate-100 tabular-nums;
}
</style>
