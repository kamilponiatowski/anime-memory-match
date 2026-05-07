import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import type { GameCard } from '@/types/game.types'

function makeCard(id: string, characterId: number): GameCard {
  return {
    id,
    characterId,
    characterName: `Char ${characterId}`,
    imageUrl: '',
    animeTitle: 'Test Anime',
    isFlipped: false,
    isMatched: false,
  }
}

describe('gameStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initialises with idle status', () => {
    const store = useGameStore()
    expect(store.status).toBe('idle')
    expect(store.moves).toBe(0)
    expect(store.matchedPairs).toBe(0)
  })

  it('initGame sets cards and resets counters', () => {
    const store = useGameStore()
    const cards = [makeCard('a', 1), makeCard('b', 1)]
    store.initGame(cards, 1)
    expect(store.cards).toHaveLength(2)
    expect(store.totalPairs).toBe(1)
    expect(store.moves).toBe(0)
    expect(store.status).toBe('playing')
  })

  it('flipCard increments moves and flips card', () => {
    const store = useGameStore()
    const cards = [makeCard('card-1', 1), makeCard('card-2', 2)]
    store.initGame(cards, 2)

    store.flipCard('card-1')
    expect(store.moves).toBe(1)
    expect(store.cards[0]!.isFlipped).toBe(true)
    expect(store.flippedCards).toHaveLength(1)
  })

  it('checkMatch returns true for matching pair and marks as matched', () => {
    const store = useGameStore()
    const cards = [makeCard('card-1a', 1), makeCard('card-1b', 1)]
    store.initGame(cards, 1)

    store.flipCard('card-1a')
    store.flipCard('card-1b')

    const result = store.checkMatch()
    expect(result).toBe(true)
    expect(store.matchedPairs).toBe(1)
    expect(store.cards[0]!.isMatched).toBe(true)
    expect(store.cards[1]!.isMatched).toBe(true)
    expect(store.isGameFinished).toBe(true)
  })

  it('checkMatch returns false for non-matching pair', () => {
    const store = useGameStore()
    const cards = [makeCard('card-1', 1), makeCard('card-2', 2), makeCard('card-3', 1), makeCard('card-4', 2)]
    store.initGame(cards, 2)

    store.flipCard('card-1')
    store.flipCard('card-2')

    const result = store.checkMatch()
    expect(result).toBe(false)
    expect(store.matchedPairs).toBe(0)
  })

  it('resetFlipped unflips both cards', () => {
    const store = useGameStore()
    const cards = [makeCard('card-1', 1), makeCard('card-2', 2), makeCard('card-3', 1), makeCard('card-4', 2)]
    store.initGame(cards, 2)

    store.flipCard('card-1')
    store.flipCard('card-2')
    store.resetFlipped()

    expect(store.cards[0]!.isFlipped).toBe(false)
    expect(store.cards[1]!.isFlipped).toBe(false)
    expect(store.flippedCards).toHaveLength(0)
  })

  describe('accuracy', () => {
    it('returns 100 when no moves have been made', () => {
      const store = useGameStore()
      expect(store.accuracy).toBe(100)
    })

    it('returns 100 for a perfect game (totalPairs*2 moves)', () => {
      const store = useGameStore()
      const cards = [
        makeCard('c1a', 1), makeCard('c1b', 1),
        makeCard('c2a', 2), makeCard('c2b', 2),
      ]
      store.initGame(cards, 2)
      // Perfect: flip each matching pair directly
      store.flipCard('c1a')
      store.flipCard('c1b')
      store.checkMatch()
      store.flipCard('c2a')
      store.flipCard('c2b')
      store.checkMatch()
      // 4 total moves for 2 pairs = perfect = 100%
      expect(store.accuracy).toBe(100)
    })

    it('returns 50 when twice as many moves as optimal', () => {
      const store = useGameStore()
      const cards = [
        makeCard('c1a', 1), makeCard('c1b', 1),
        makeCard('c2a', 2), makeCard('c2b', 2),
      ]
      store.initGame(cards, 2)
      // Optimal = 4 moves. We'll simulate 8 moves (flip a wrong pair first each time)
      store.flipCard('c1a'); store.flipCard('c2a'); store.checkMatch(); store.resetFlipped()
      store.flipCard('c1b'); store.flipCard('c2b'); store.checkMatch(); store.resetFlipped()
      store.flipCard('c1a'); store.flipCard('c1b'); store.checkMatch()
      store.flipCard('c2a'); store.flipCard('c2b'); store.checkMatch()
      // 8 moves, optimal 4 → accuracy = round(4/8*100) = 50
      expect(store.accuracy).toBe(50)
    })
  })

  it('resetGame returns to idle state', () => {
    const store = useGameStore()
    store.initGame([makeCard('c1', 1), makeCard('c2', 1)], 1)
    store.resetGame()
    expect(store.status).toBe('idle')
    expect(store.cards).toHaveLength(0)
    expect(store.moves).toBe(0)
  })
})
