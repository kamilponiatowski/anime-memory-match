import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_ANIME_PRESETS } from '@/types/game.types'
import { anilistRepository } from '@/api/anilist/anilistRepository'
import type { AnimePreset, Character } from '@/types/game.types'

export const useAnimeStore = defineStore('anime', () => {
  // ── State ──────────────────────────────────────────────────────────
  const selectedAnime = ref<AnimePreset | null>(null)
  const characters = ref<Character[]>([])
  const isLoadingCharacters = ref(false)
  const isSearching = ref(false)
  const searchQuery = ref('')
  const searchResults = ref<AnimePreset[]>([])
  const error = ref<string | null>(null)

  // ── Getters ────────────────────────────────────────────────────────
  const presets = computed(() => DEFAULT_ANIME_PRESETS)
  const hasCharacters = computed(() => characters.value.length > 0)

  // ── Actions ────────────────────────────────────────────────────────
  async function selectAnime(anime: AnimePreset): Promise<void> {
    selectedAnime.value = anime
    characters.value = []
    error.value = null
    isLoadingCharacters.value = true
    try {
      characters.value = await anilistRepository.getCharactersByAnimeId(anime.id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Błąd ładowania postaci'
    } finally {
      isLoadingCharacters.value = false
    }
  }

  async function searchAnime(query: string): Promise<void> {
    isSearching.value = true
    try {
      searchResults.value = await anilistRepository.searchAnime(query)
    } catch {
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  function clearSearch(): void {
    searchQuery.value = ''
    searchResults.value = []
    isSearching.value = false
  }

  function reset(): void {
    selectedAnime.value = null
    characters.value = []
    isLoadingCharacters.value = false
    isSearching.value = false
    searchQuery.value = ''
    searchResults.value = []
    error.value = null
  }

  return {
    selectedAnime,
    characters,
    isLoadingCharacters,
    isSearching,
    searchQuery,
    searchResults,
    presets,
    error,
    hasCharacters,
    selectAnime,
    searchAnime,
    clearSearch,
    reset,
  }
})
