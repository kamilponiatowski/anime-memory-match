export interface AniListCharacter {
  id: number
  name: {
    full: string
    native: string | null
  }
  image: {
    large: string
    medium: string
  }
}

export interface AniListMedia {
  id: number
  title: {
    romaji: string
    english: string | null
  }
  characters: {
    nodes: AniListCharacter[]
  }
}

export interface AniListPageInfo {
  total: number
  currentPage: number
  hasNextPage: boolean
}

export interface SearchAnimeResponse {
  Page: {
    pageInfo: AniListPageInfo
    media: Array<{
      id: number
      title: {
        romaji: string
        english: string | null
      }
    }>
  }
}

export interface CharactersResponse {
  Media: {
    id: number
    title: {
      romaji: string
      english: string | null
    }
    characters: {
      nodes: AniListCharacter[]
    }
  }
}

export interface TopAnimeResponse {
  Page: {
    media: Array<{
      id: number
      title: {
        romaji: string
        english: string | null
      }
    }>
  }
}
