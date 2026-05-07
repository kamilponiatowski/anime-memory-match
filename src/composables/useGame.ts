import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useAnimeStore } from '@/stores/animeStore'
import { useCards } from './useCards'
import { useSound } from './useSound'
import { DIFFICULTY_CONFIG } from '@/types/game.types'
import type { Difficulty } from '@/types/game.types'

/**
 * How long (ms) non-matching cards remain face-up before flipping back.
 * Shorter = snappier game feel.
 */
const FLIP_BACK_DELAY = 450

// ── Module-level timer state — survives between handleCardClick calls ────────
let _flipBackTimer: ReturnType<typeof setTimeout> | null = null
let _isFlipPending = false // true while 2 unmatched cards are face-up

export function useGame() {
  const gameStore = useGameStore()
  const animeStore = useAnimeStore()
  const { buildCards } = useCards()
  const { playFlip, playMatch, playNoMatch, playVictory } = useSound()

  /** True only during the synchronous match evaluation — briefly flickers */
  const isChecking = ref(false)

  /** Cancel a pending flip-back timeout and immediately reset the 2 cards */
  function _cancelPendingFlipBack() {
    if (_flipBackTimer !== null) {
      clearTimeout(_flipBackTimer)
      _flipBackTimer = null
    }
    if (_isFlipPending) {
      gameStore.resetFlipped()
      _isFlipPending = false
    }
    isChecking.value = false
  }

  async function startGame(difficulty: Difficulty = 'medium') {
    _cancelPendingFlipBack() // abort any in-progress flip animation
    if (!animeStore.hasCharacters) {
      console.error('Brak postaci — najpierw wybierz anime')
      return
    }
    const cards = buildCards(animeStore.characters, difficulty)
    const { pairs } = DIFFICULTY_CONFIG[difficulty]
    gameStore.difficulty = difficulty
    gameStore.initGame(cards, pairs)
  }

  /** Replay the same card layout — same order, reset state */
  function replayGame() {
    _cancelPendingFlipBack()
    gameStore.replayGame()
  }

  async function handleCardClick(cardId: string) {
    if (gameStore.status !== 'playing') return

    const target = gameStore.cards.find((c) => c.id === cardId)
    if (!target || target.isFlipped || target.isMatched) return

    // Interrupt: if 2 unmatched cards are waiting to flip back, do it instantly
    // so the player can immediately start evaluating the next pair
    if (_isFlipPending) {
      _cancelPendingFlipBack()
    }

    // Brief sync guard — prevents flipping a 3rd card in the same tick
    if (isChecking.value) return

    gameStore.flipCard(cardId)
    playFlip()

    if (gameStore.flippedCards.length < 2) return

    // Two cards are now face-up — evaluate immediately (no delay)
    isChecking.value = true
    const matched = gameStore.checkMatch()

    if (matched) {
      playMatch()
      isChecking.value = false
      if (gameStore.isGameFinished) {
        await delay(300)
        playVictory()
      }
    } else {
      playNoMatch()
      // Let the player see both cards briefly, then flip back
      _isFlipPending = true
      _flipBackTimer = setTimeout(() => {
        gameStore.resetFlipped()
        _isFlipPending = false
        _flipBackTimer = null
      }, FLIP_BACK_DELAY)
      isChecking.value = false // allow interrupt clicks during the wait
    }
  }

  function restartGame() {
    _cancelPendingFlipBack()
    gameStore.resetGame()
  }

  return {
    isChecking,
    startGame,
    replayGame,
    handleCardClick,
    restartGame,
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
