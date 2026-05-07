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

  // ── Top anime (fetched once, merged with hardcoded presets) ──────────
  const topAnime = ref<AnimePreset[]>([])
  const randomPool = ref<AnimePreset[]>([]) // full pool (50) for dice randomisation
  let _topLoaded = false

  // ── Getters ────────────────────────────────────────────────────────
  const presets = computed(() => DEFAULT_ANIME_PRESETS)

  /** Hardcoded presets + unique entries from top 10, deduped by id */
  const allPresets = computed<AnimePreset[]>(() => {
    const existingIds = new Set(DEFAULT_ANIME_PRESETS.map((p) => p.id))
    const unique = topAnime.value.filter((p) => !existingIds.has(p.id))
    return [...DEFAULT_ANIME_PRESETS, ...unique]
  })

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

  /** Fetch top 50 from AniList once per session — silently ignores errors */
  async function loadTopAnime(): Promise<void> {
    if (_topLoaded) return
    _topLoaded = true
    try {
      const all = await anilistRepository.getTopAnime(50)
      randomPool.value = all
      topAnime.value = all.slice(0, 10) // first 10 shown as preset chips
    } catch {
      // presets still work without top anime
    }
  }

  /** Pick a random anime from the full API pool and select it */
  async function selectRandomAnime(): Promise<void> {
    // Ensure pool is loaded — no-op if already fetched
    await loadTopAnime()
    const pool = randomPool.value.length > 0 ? randomPool.value : DEFAULT_ANIME_PRESETS
    const pick = pool[Math.floor(Math.random() * pool.length)]!
    await selectAnime(pick)
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
    allPresets,
    error,
    hasCharacters,
    selectAnime,
    selectRandomAnime,
    searchAnime,
    clearSearch,
    loadTopAnime,
    reset,
  }
})
