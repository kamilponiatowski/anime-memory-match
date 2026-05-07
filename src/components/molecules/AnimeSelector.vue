<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAniList } from '@/composables/useAniList'
import type { AnimePreset } from '@/types/game.types'

const {
  searchQuery,
  searchResults,
  presets,
  selectedAnime,
  isSearching,
  isLoadingCharacters,
  error,
  onSearchInput,
  onSelectAnime,
} = useAniList()

const showDropdown = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const displayList = computed<AnimePreset[]>(() =>
  searchQuery.value.length >= 2 ? searchResults.value : presets.value,
)

function handleInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  onSearchInput(val)
  showDropdown.value = true
}

function selectAndClose(anime: AnimePreset) {
  onSelectAnime(anime)
  showDropdown.value = false
  inputRef.value?.blur()
}

function onFocus() {
  showDropdown.value = true
}

function onBlur() {
  setTimeout(() => { showDropdown.value = false }, 150)
}

function clearSelection() {
  onSearchInput('')
  showDropdown.value = true
  setTimeout(() => inputRef.value?.focus(), 0)
}
</script>

<template>
  <div class="space-y-3">
    <!-- Trigger / input field -->
    <div class="selector-field" :class="{ 'is-open': showDropdown, 'is-selected': !!selectedAnime }">
      <!-- Jeśli coś zaznaczono i nie piszemy — pokaż chip -->
      <div v-if="selectedAnime && !showDropdown" class="selected-chip">
        <span class="selected-dot" aria-hidden="true" />
        <span class="selected-label truncate">{{ selectedAnime.title }}</span>
        <!-- Loading / done -->
        <span v-if="isLoadingCharacters" class="chip-spinner" aria-hidden="true" />
        <svg v-else-if="!error" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true">
          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd"/>
        </svg>
        <button class="chip-clear" :aria-label="`Odznacz ${selectedAnime.title}`" @click.stop="clearSelection">
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
          </svg>
        </button>
      </div>

      <!-- Input -->
      <div v-else class="input-row">
        <!-- Search icon -->
        <svg viewBox="0 0 20 20" fill="currentColor" class="input-icon" aria-hidden="true">
          <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd"/>
        </svg>
        <input
          ref="inputRef"
          :value="searchQuery"
          type="text"
          class="selector-input"
          placeholder="Szukaj anime..."
          autocomplete="off"
          aria-label="Wyszukaj anime"
          :aria-expanded="showDropdown"
          aria-haspopup="listbox"
          @input="handleInput"
          @focus="onFocus"
          @blur="onBlur"
        />
        <!-- Spinner wyszukiwania -->
        <span v-if="isSearching" class="chip-spinner mr-2" aria-hidden="true" />
      </div>

      <!-- Dropdown -->
      <Transition name="dropdown">
        <ul
          v-if="showDropdown"
          role="listbox"
          aria-label="Wyniki wyszukiwania anime"
          class="selector-dropdown"
        >
          <li v-if="isSearching" role="option" aria-selected="false" class="dropdown-item text-slate-500">
            Wyszukuję...
          </li>
          <template v-else>
            <li
              v-for="anime in displayList"
              :key="anime.id"
              role="option"
              :aria-selected="selectedAnime?.id === anime.id"
              class="dropdown-item"
              :class="{ 'is-active': selectedAnime?.id === anime.id }"
              @mousedown.prevent="selectAndClose(anime)"
            >
              <svg
                v-if="selectedAnime?.id === anime.id"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-4 h-4 text-violet-400 shrink-0"
                aria-hidden="true"
              >
                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd"/>
              </svg>
              <span :class="selectedAnime?.id === anime.id ? 'text-violet-300 font-semibold' : ''">{{ anime.title }}</span>
            </li>
            <li v-if="displayList.length === 0" role="option" aria-selected="false" class="dropdown-item text-slate-500">
              Brak wyników dla „{{ searchQuery }}"
            </li>
          </template>
        </ul>
      </Transition>
    </div>

    <!-- Error -->
    <p v-if="error" role="alert" class="text-xs text-red-400 flex items-center gap-1.5">
      <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 shrink-0" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/>
      </svg>
      {{ error }}
    </p>

    <!-- Szybki wybór presetów -->
    <div class="space-y-2">
      <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Popularne anime</p>
      <div class="flex flex-wrap gap-1.5" role="group" aria-label="Szybki wybór anime">
        <button
          v-for="preset in presets"
          :key="preset.id"
          class="preset-chip"
          :class="{ 'is-active': selectedAnime?.id === preset.id }"
          :aria-pressed="selectedAnime?.id === preset.id"
          @click="selectAndClose(preset)"
        >
          {{ preset.title }}
        </button>
      </div>
    </div>

    <!-- Ładowanie postaci -->
    <Transition name="fade">
      <p v-if="selectedAnime && isLoadingCharacters" class="text-xs text-slate-400 flex items-center gap-2">
        <span class="chip-spinner" aria-hidden="true" />
        Ładowanie postaci...
      </p>
      <p v-else-if="selectedAnime && !error && !isLoadingCharacters" class="text-xs text-emerald-400 flex items-center gap-1.5">
        <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 shrink-0" aria-hidden="true">
          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd"/>
        </svg>
        Postacie załadowano
      </p>
    </Transition>
  </div>
</template>

<style scoped>
/* Pole selectora */
.selector-field {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.selector-field.is-open,
.selector-field:focus-within {
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}
.selector-field.is-selected {
  border-color: rgba(139, 92, 246, 0.4);
}

/* Chip zaznaczonego anime */
.selected-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.75rem;
  min-width: 0;
}
.selected-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #d946ef);
  flex-shrink: 0;
}
.selected-label {
  flex: 1;
  min-width: 0;
  font-size: 0.925rem;
  font-weight: 600;
  color: #e2e8f0;
}
.chip-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border: none;
  color: #94a3b8;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.chip-clear:hover { background: rgba(255,255,255,0.15); color: #fff; }

/* Input row */
.input-row {
  display: flex;
  align-items: center;
  padding: 0.1rem 0.75rem;
}
.input-icon {
  width: 1rem;
  height: 1rem;
  color: #64748b;
  flex-shrink: 0;
  margin-right: 0.5rem;
}
.selector-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.925rem;
  color: #e2e8f0;
  padding: 0.6rem 0;
}
.selector-input::placeholder { color: #475569; }

/* Spinner */
.chip-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.15);
  border-top-color: #a78bfa;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Dropdown lista */
.selector-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 30;
  background: #1e1b2e;
  border: 1.5px solid rgba(139, 92, 246, 0.3);
  border-radius: 14px;
  overflow: hidden;
  max-height: 260px;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
  scrollbar-width: thin;
  scrollbar-color: rgba(139,92,246,0.3) transparent;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  font-size: 0.9rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: background 0.1s;
}
.dropdown-item:hover { background: rgba(139, 92, 246, 0.12); }
.dropdown-item.is-active { background: rgba(139, 92, 246, 0.18); }

/* Preset chips */
.preset-chip {
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #94a3b8;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.preset-chip:hover {
  background: rgba(139,92,246,0.12);
  color: #c4b5fd;
  border-color: rgba(139,92,246,0.35);
}
.preset-chip.is-active {
  background: rgba(139,92,246,0.2);
  color: #c4b5fd;
  border-color: rgba(139,92,246,0.5);
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from,
.dropdown-leave-to { opacity: 0; transform: translateY(-6px); }

.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>

