import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { DIFFICULTY_CONFIG } from '@/types/game.types'
import type { GameCard, GameStatus, Difficulty, GameResult } from '@/types/game.types'

export const useGameStore = defineStore('game', () => {
  // ── State ──────────────────────────────────────────────────────────
  const cards = ref<GameCard[]>([])
  const flippedCards = ref<GameCard[]>([])
  const matchedPairs = ref(0)
  const totalPairs = ref(0)
  const moves = ref(0)
  const startTime = ref<number | null>(null)
  const endTime = ref<number | null>(null)
  const status = ref<GameStatus>('idle')
  const difficulty = ref<Difficulty>('medium')

  // ── Getters ────────────────────────────────────────────────────────
  const isGameFinished = computed(
    () => totalPairs.value > 0 && matchedPairs.value === totalPairs.value,
  )

  const elapsedSeconds = computed(() => {
    if (!startTime.value) return 0
    const end = endTime.value ?? Date.now()
    return Math.floor((end - startTime.value) / 1000)
  })

  const accuracy = computed(() => {
    if (moves.value === 0) return 100
    // Perfect game = totalPairs * 2 flips (each card flipped exactly once)
    // Accuracy = how close the player was to the perfect number of moves
    const perfect = totalPairs.value * 2
    return Math.min(100, Math.round((perfect / moves.value) * 100))
  })

  const progressPercent = computed(() => {
    if (totalPairs.value === 0) return 0
    return Math.round((matchedPairs.value / totalPairs.value) * 100)
  })

  const gridCols = computed(() => DIFFICULTY_CONFIG[difficulty.value].cols)

  const gameResult = computed<GameResult | null>(() => {
    if (!isGameFinished.value) return null
    return {
      totalPairs: totalPairs.value,
      moves: moves.value,
      timeSeconds: elapsedSeconds.value,
      accuracy: accuracy.value,
    }
  })

  // ── Actions ────────────────────────────────────────────────────────
  function initGame(gameCards: GameCard[], pairs: number) {
    cards.value = gameCards
    totalPairs.value = pairs
    matchedPairs.value = 0
    moves.value = 0
    flippedCards.value = []
    startTime.value = null
    endTime.value = null
    status.value = 'playing'
  }

  function startTimer() {
    if (!startTime.value) {
      startTime.value = Date.now()
    }
  }

  function flipCard(cardId: string) {
    const card = cards.value.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return
    if (flippedCards.value.length >= 2) return

    card.isFlipped = true
    flippedCards.value.push(card)
    moves.value++
    startTimer()
  }

  function checkMatch(): boolean {
    if (flippedCards.value.length !== 2) return false

    const a = flippedCards.value[0]!
    const b = flippedCards.value[1]!
    const isMatch = a.characterId === b.characterId

    if (isMatch) {
      a.isMatched = true
      b.isMatched = true
      matchedPairs.value++
      flippedCards.value = []

      if (isGameFinished.value) {
        endTime.value = Date.now()
        status.value = 'finished'
      }
    }

    return isMatch
  }

  function resetFlipped() {
    for (const card of flippedCards.value) {
      card.isFlipped = false
    }
    flippedCards.value = []
  }

  function resetGame() {
    cards.value = []
    flippedCards.value = []
    matchedPairs.value = 0
    totalPairs.value = 0
    moves.value = 0
    startTime.value = null
    endTime.value = null
    status.value = 'idle'
  }

  return {
    cards,
    flippedCards,
    matchedPairs,
    totalPairs,
    moves,
    status,
    difficulty,
    isGameFinished,
    elapsedSeconds,
    accuracy,
    progressPercent,
    gridCols,
    gameResult,
    initGame,
    flipCard,
    checkMatch,
    resetFlipped,
    resetGame,
  }
})
