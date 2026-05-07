export type CardId = string

export type GameStatus =
  | 'idle'
  | 'selecting-anime'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'finished'

export interface Character {
  id: number
  name: {
    full: string
    native: string | null
  }
  image: {
    large: string
    medium: string
  }
  animeTitle: string
}

export interface GameCard {
  id: CardId
  characterId: number
  characterName: string
  imageUrl: string
  animeTitle: string
  isFlipped: boolean
  isMatched: boolean
}

export interface GameResult {
  totalPairs: number
  moves: number
  timeSeconds: number
  accuracy: number
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export const DIFFICULTY_CONFIG: Record<Difficulty, { pairs: number; cols: number }> = {
  easy: { pairs: 6, cols: 4 },
  medium: { pairs: 8, cols: 4 },
  hard: { pairs: 12, cols: 6 },
}

export interface AnimePreset {
  id: number
  title: string
  slug: string
  coverUrl?: string
}

export const DEFAULT_ANIME_PRESETS: AnimePreset[] = [
  { id: 20, title: 'Naruto', slug: 'naruto' },
  { id: 1535, title: 'Death Note', slug: 'death-note' },
  { id: 97668, title: 'One-Punch Man', slug: 'one-punch-man' },
  { id: 21, title: 'One Piece', slug: 'one-piece' },
  { id: 269, title: 'Bleach', slug: 'bleach' },
  { id: 813, title: 'Dragon Ball Z', slug: 'dragon-ball-z' },
  { id: 153518, title: 'Frieren', slug: 'frieren' },
  { id: 131681, title: 'Oshi no Ko', slug: 'oshi-no-ko' },
  { id: 226, title: 'Elfen Lied', slug: 'elfen-lied' },
]
