import { ref } from 'vue'
import { DIFFICULTY_CONFIG } from '@/types/game.types'
import type { GameCard, Character, Difficulty } from '@/types/game.types'
import { shuffle } from '@/utils/shuffle'

export function useCards() {
  const isReady = ref(false)

  function buildCards(characters: Character[], difficulty: Difficulty): GameCard[] {
    const { pairs } = DIFFICULTY_CONFIG[difficulty]
    const selected = shuffle([...characters]).slice(0, pairs)

    const cards: GameCard[] = selected.flatMap((character) => [
      createCard(character, `${character.id}-a`),
      createCard(character, `${character.id}-b`),
    ])

    isReady.value = true
    return shuffle(cards)
  }

  function createCard(character: Character, uniqueSuffix: string): GameCard {
    return {
      id: `card-${uniqueSuffix}`,
      characterId: character.id,
      characterName: character.name.full,
      imageUrl: character.image.large,
      animeTitle: character.animeTitle,
      isFlipped: false,
      isMatched: false,
    }
  }

  return { buildCards, isReady }
}
