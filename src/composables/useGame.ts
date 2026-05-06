import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useAnimeStore } from '@/stores/animeStore'
import { useCards } from './useCards'
import { useSound } from './useSound'
import { DIFFICULTY_CONFIG } from '@/types/game.types'
import type { Difficulty } from '@/types/game.types'

const FLIP_BACK_DELAY = 900

export function useGame() {
  const gameStore = useGameStore()
  const animeStore = useAnimeStore()
  const { buildCards } = useCards()
  const { playFlip, playMatch, playNoMatch, playVictory } = useSound()

  const isChecking = ref(false)

  async function startGame(difficulty: Difficulty = 'medium') {
    if (!animeStore.hasCharacters) {
      console.error('Brak postaci — najpierw wybierz anime')
      return
    }

    const cards = buildCards(animeStore.characters, difficulty)
    const { pairs } = DIFFICULTY_CONFIG[difficulty]

    gameStore.difficulty = difficulty
    gameStore.initGame(cards, pairs)
  }

  async function handleCardClick(cardId: string) {
    if (isChecking.value) return
    if (gameStore.status !== 'playing') return

    gameStore.flipCard(cardId)
    playFlip()

    if (gameStore.flippedCards.length === 2) {
      isChecking.value = true

      await delay(FLIP_BACK_DELAY)

      const matched = gameStore.checkMatch()
      if (matched) {
        playMatch()
        if (gameStore.isGameFinished) {
          await delay(300)
          playVictory()
        }
      } else {
        gameStore.resetFlipped()
        playNoMatch()
      }

      isChecking.value = false
    }
  }

  function restartGame() {
    gameStore.resetGame()
  }

  return {
    isChecking,
    startGame,
    handleCardClick,
    restartGame,
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
