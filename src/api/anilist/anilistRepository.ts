import { graphqlRequest } from './client'
import { GET_ANIME_CHARACTERS, SEARCH_ANIME, GET_TOP_ANIME } from './queries'
import type { CharactersResponse, SearchAnimeResponse, AniListCharacter, TopAnimeResponse } from '../types/anilist.types'
import type { Character, AnimePreset } from '@/types/game.types'

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
    const data = await graphqlRequest<CharactersResponse>(GET_ANIME_CHARACTERS, {
      mediaId,
      perPage,
    })

    const title = data.Media.title.english ?? data.Media.title.romaji

    return data.Media.characters.nodes
      .filter((node) => node.name.full.trim().toLowerCase() !== 'narrator')
      .map((node) => mapToCharacter(node, title))
  },

  async searchAnime(search: string, perPage = 10): Promise<AnimePreset[]> {
    const data = await graphqlRequest<SearchAnimeResponse>(SEARCH_ANIME, { search, perPage })

    return data.Page.media.map((media) => ({
      id: media.id,
      title: media.title.english ?? media.title.romaji,
      slug: (media.title.english ?? media.title.romaji)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    }))
  },

  async getCharactersBySlug(slug: string, presets: AnimePreset[]): Promise<Character[]> {
    const preset = presets.find((p) => p.slug === slug)
    if (!preset) {
      throw new Error(`Anime o slug "${slug}" nie istnieje w presetach`)
    }
    return this.getCharactersByAnimeId(preset.id)
  },

  async getTopAnime(perPage = 10): Promise<AnimePreset[]> {
    const data = await graphqlRequest<TopAnimeResponse>(GET_TOP_ANIME, { perPage })
    return data.Page.media.map((media) => ({
      id: media.id,
      title: media.title.english ?? media.title.romaji,
      slug: (media.title.english ?? media.title.romaji)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    }))
  },
}
