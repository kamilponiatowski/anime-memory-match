import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCards } from '@/composables/useCards'
import type { Character } from '@/types/game.types'

function makeCharacter(id: number): Character {
  return {
    id,
    name: { full: `Character ${id}`, native: null },
    image: { large: `https://example.com/${id}.jpg`, medium: `https://example.com/${id}_m.jpg` },
    animeTitle: 'Test Anime',
  }
}

const characters: Character[] = Array.from({ length: 15 }, (_, i) => makeCharacter(i + 1))

describe('useCards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('easy: builds 12 cards (6 pairs)', () => {
    const { buildCards } = useCards()
    const cards = buildCards(characters, 'easy')
    expect(cards).toHaveLength(12)
  })

  it('medium: builds 16 cards (8 pairs)', () => {
    const { buildCards } = useCards()
    const cards = buildCards(characters, 'medium')
    expect(cards).toHaveLength(16)
  })

  it('hard: builds 24 cards (12 pairs)', () => {
    const { buildCards } = useCards()
    const cards = buildCards(characters, 'hard')
    expect(cards).toHaveLength(24)
  })

  it('each character appears exactly twice', () => {
    const { buildCards } = useCards()
    const cards = buildCards(characters, 'medium')
    const counts = new Map<number, number>()
    for (const card of cards) {
      counts.set(card.characterId, (counts.get(card.characterId) ?? 0) + 1)
    }
    for (const count of counts.values()) {
      expect(count).toBe(2)
    }
  })

  it('all cards start unflipped and unmatched', () => {
    const { buildCards } = useCards()
    const cards = buildCards(characters, 'easy')
    for (const card of cards) {
      expect(card.isFlipped).toBe(false)
      expect(card.isMatched).toBe(false)
    }
  })

  it('card ids are unique', () => {
    const { buildCards } = useCards()
    const cards = buildCards(characters, 'medium')
    const ids = cards.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
