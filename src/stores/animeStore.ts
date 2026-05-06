import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_ANIME_PRESETS } from '@/types/game.types'
import type { AnimePreset, Character } from '@/types/game.types'
import { anilistRepository } from '@/api/anilist/anilistRepository'

export const useAnimeStore = defineStore('anime', () => {
  // ── State ──────────────────────────────────────────────────────────
  const selectedAnime = ref<AnimePreset | null>(null)
  const searchQuery = ref('')
  const searchResults = ref<AnimePreset[]>([])
  const characters = ref<Character[]>([])
  const isSearching = ref(false)
  const isLoadingCharacters = ref(false)
  const error = ref<string | null>(null)

  // ── Getters ────────────────────────────────────────────────────────
  const presets = computed(() => DEFAULT_ANIME_PRESETS)
  const hasCharacters = computed(() => characters.value.length > 0)

  // ── Actions ────────────────────────────────────────────────────────
  async function searchAnime(query: string) {
    if (!query.trim() || query.trim().length < 2) return

    isSearching.value = true
    error.value = null

    try {
      searchResults.value = await anilistRepository.searchAnime(query)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Błąd wyszukiwania'
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  async function selectAnime(anime: AnimePreset) {
    selectedAnime.value = anime
    searchQuery.value = ''
    searchResults.value = []
    isLoadingCharacters.value = true
    error.value = null

    try {
      characters.value = await anilistRepository.getCharactersByAnimeId(anime.id, 50)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Nie udało się załadować postaci'
      characters.value = []
    } finally {
      isLoadingCharacters.value = false
    }
  }

  function clearSearch() {
    searchQuery.value = ''
    searchResults.value = []
  }

  function reset() {
    selectedAnime.value = null
    characters.value = []
    error.value = null
    clearSearch()
  }

  return {
    selectedAnime,
    searchQuery,
    searchResults,
    characters,
    isSearching,
    isLoadingCharacters,
    error,
    presets,
    hasCharacters,
    searchAnime,
    selectAnime,
    clearSearch,
    reset,
  }
})
