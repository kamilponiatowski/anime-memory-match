<script setup lang="ts">
import { computed } from 'vue'
import GameCard from '@/components/molecules/GameCard.vue'
import BaseCardSkeleton from '@/components/atoms/BaseCardSkeleton.vue'
import { useGameStore } from '@/stores/gameStore'
import { DIFFICULTY_CONFIG } from '@/types/game.types'
import { storeToRefs } from 'pinia'

interface Props {
  isDisabled?: boolean
}

withDefaults(defineProps<Props>(), {
  isDisabled: false,
})

const emit = defineEmits<{
  cardFlip: [cardId: string]
}>()

const gameStore = useGameStore()
const { cards, gridCols, matchedPairs, totalPairs, difficulty } = storeToRefs(gameStore)

const gridClass = computed(() => ({
  'grid gap-1 sm:gap-2': true,
  'grid-cols-4': gridCols.value === 4,
  'grid-cols-6': gridCols.value === 6,
}))

// Oblicz liczbę wierszy dynamicznie na podstawie trudności
const gridRows = computed(() => {
  const cfg = DIFFICULTY_CONFIG[difficulty.value]
  return Math.ceil((cfg.pairs * 2) / cfg.cols)
})

// Wysokość wiersza kart skalowana do ekranu
// overhead ≈ 88px (topbar 40 + progressbar 4 + padding 16 + gap 28)
const rowHeight = computed(
  () => `clamp(55px, calc((100svh - 88px) / ${gridRows.value}), 130px)`,
)
</script>

<template>
  <section aria-label="Plansza gry">
    <!-- Ogłoszenie stanu dla screen readerów -->
    <p class="sr-only" aria-live="polite" aria-atomic="false">
      {{ matchedPairs }} par znalezionych z {{ totalPairs }}.
    </p>

    <!-- Skeleton podczas ładowania -->
    <div v-if="cards.length === 0" :class="gridClass" :style="{ gridAutoRows: rowHeight }">
      <BaseCardSkeleton v-for="n in 16" :key="n" />
    </div>

    <!-- Plansza kart -->
    <TransitionGroup
      v-else
      tag="div"
      name="card-appear"
      :class="gridClass"
      :style="{ gridAutoRows: rowHeight }"
      role="grid"
      :aria-label="`Plansza ${gridCols} kolumn, ${cards.length} kart`"
    >
      <GameCard
        v-for="(card, index) in cards"
        :key="card.id"
        :card="card"
        :is-disabled="isDisabled"
        :style="{ '--card-delay': `${index * 40}ms` }"
        @flip="emit('cardFlip', $event)"
      />
    </TransitionGroup>
  </section>
</template>

<style scoped>
.card-appear-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
  transition-delay: var(--card-delay, 0ms);
}
.card-appear-enter-from {
  opacity: 0;
  transform: scale(0.75) rotateY(30deg);
}
.card-appear-leave-active {
  transition: opacity 0.2s ease;
}
.card-appear-leave-to {
  opacity: 0;
}
</style>
