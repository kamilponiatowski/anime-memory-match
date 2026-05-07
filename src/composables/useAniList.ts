import { computed } from 'vue'
import { useAnimeStore } from '@/stores/animeStore'
import { useDebounceFn } from '@vueuse/core'
import type { AnimePreset } from '@/types/game.types'

export function useAniList() {
  const animeStore = useAnimeStore()

  const debouncedSearch = useDebounceFn((query: string) => {
    animeStore.searchAnime(query)
  }, 400)

  function onSearchInput(query: string) {
    animeStore.searchQuery = query
    if (query.length >= 2) {
      debouncedSearch(query)
    } else {
      animeStore.clearSearch()
    }
  }

  async function onSelectAnime(anime: AnimePreset) {
    await animeStore.selectAnime(anime)
  }

  return {
    searchQuery: computed(() => animeStore.searchQuery),
    searchResults: computed(() => animeStore.searchResults),
    presets: computed(() => animeStore.presets),
    allPresets: computed(() => animeStore.allPresets),
    selectedAnime: computed(() => animeStore.selectedAnime),
    characters: computed(() => animeStore.characters),
    isSearching: computed(() => animeStore.isSearching),
    isLoadingCharacters: computed(() => animeStore.isLoadingCharacters),
    error: computed(() => animeStore.error),
    hasCharacters: computed(() => animeStore.hasCharacters),
    loadTopAnime: () => animeStore.loadTopAnime(),
    selectRandomAnime: () => animeStore.selectRandomAnime(),
    onSearchInput,
    onSelectAnime,
  }
}
