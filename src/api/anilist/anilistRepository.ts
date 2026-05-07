import { graphqlRequest } from './client'
import { GET_ANIME_CHARACTERS, SEARCH_ANIME, GET_TOP_ANIME } from './queries'
import type { CharactersResponse, SearchAnimeResponse, AniListCharacter, TopAnimeResponse } from '../types/anilist.types'
import type { Character, AnimePreset } from '@/types/game.types'

/** Cache keyed by mediaId — persists for the lifetime of the session */
const characterCache = new Map<number, Character[]>()
/** Cache keyed by search query — prevents re-fetching the same query */
const searchCache = new Map<string, AnimePreset[]>()
/** Top-anime results (fetched at most once) */
let topAnimeCache: AnimePreset[] | null = null

function mapToCharacter(raw: AniListCharacter, animeTitle: string): Character {
  return {
    id: raw.id,
    name: {
      full: raw.name.full,
      native: raw.name.native,
    },
    image: {
      large: raw.image.large,
      medium: raw.image.medium,
    },
    animeTitle,
  }
}

export const anilistRepository = {
  async getCharactersByAnimeId(mediaId: number, perPage = 20): Promise<Character[]> {
    const cached = characterCache.get(mediaId)
    if (cached) return cached

    const data = await graphqlRequest<CharactersResponse>(GET_ANIME_CHARACTERS, {
      mediaId,
      perPage,
    })

    const title = data.Media.title.english ?? data.Media.title.romaji

    const characters = data.Media.characters.nodes
      .filter((node) => node.name.full.trim().toLowerCase() !== 'narrator')
      .map((node) => mapToCharacter(node, title))

    characterCache.set(mediaId, characters)
    return characters
  },

  async searchAnime(search: string, perPage = 10): Promise<AnimePreset[]> {
    const key = `${search.toLowerCase().trim()}:${perPage}`
    const cached = searchCache.get(key)
    if (cached) return cached

    const data = await graphqlRequest<SearchAnimeResponse>(SEARCH_ANIME, { search, perPage })

    const results = data.Page.media.map((media) => ({
      id: media.id,
      title: media.title.english ?? media.title.romaji,
      slug: (media.title.english ?? media.title.romaji)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    }))

    searchCache.set(key, results)
    return results
  },

  async getCharactersBySlug(slug: string, presets: AnimePreset[]): Promise<Character[]> {
    const preset = presets.find((p) => p.slug === slug)
    if (!preset) {
      throw new Error(`Anime o slug "${slug}" nie istnieje w presetach`)
    }
    return this.getCharactersByAnimeId(preset.id)
  },

  async getTopAnime(perPage = 10): Promise<AnimePreset[]> {
    if (topAnimeCache) return topAnimeCache

    const data = await graphqlRequest<TopAnimeResponse>(GET_TOP_ANIME, { perPage })
    const results = data.Page.media.map((media) => ({
      id: media.id,
      title: media.title.english ?? media.title.romaji,
      slug: (media.title.english ?? media.title.romaji)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    }))

    topAnimeCache = results
    return results
  },
}
