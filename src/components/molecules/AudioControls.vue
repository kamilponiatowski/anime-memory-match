<script setup lang="ts">
import { ref } from 'vue'
import { useSound } from '@/composables/useSound'

const { isAmbientOn, volume, toggleAmbient, setVolume } = useSound()

const showVolume = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

function onVolumeWrapperEnter() {
  if (hideTimer) clearTimeout(hideTimer)
  showVolume.value = true
}

function onVolumeWrapperLeave() {
  hideTimer = setTimeout(() => { showVolume.value = false }, 300)
}

function onSliderInput(e: Event) {
  setVolume(Number((e.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="audio-controls">
    <!-- ① Play / Pause button -->
    <button
      class="audio-btn"
      :aria-label="isAmbientOn ? 'Zatrzymaj muzykę' : 'Odtwórz muzykę'"
      :title="isAmbientOn ? 'Zatrzymaj muzykę' : 'Odtwórz muzykę'"
      @click="toggleAmbient"
    >
      <!-- Pause bars -->
      <svg
        v-if="isAmbientOn"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 text-violet-300"
        aria-hidden="true"
      >
        <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z"/>
      </svg>
      <!-- Play triangle -->
      <svg
        v-else
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 text-slate-400"
        aria-hidden="true"
      >
        <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z"/>
      </svg>
    </button>

    <!-- ② Volume button + dropdown slider -->
    <div
      class="volume-wrapper"
      @mouseenter="onVolumeWrapperEnter"
      @mouseleave="onVolumeWrapperLeave"
      @focusin="onVolumeWrapperEnter"
      @focusout="onVolumeWrapperLeave"
    >
      <button
        class="audio-btn"
        :aria-label="`Głośność: ${Math.round(volume * 100)}%`"
        :title="`Głośność: ${Math.round(volume * 100)}%`"
        @click="onVolumeWrapperEnter"
      >
        <!-- Volume off -->
        <svg v-if="volume === 0" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-slate-500" aria-hidden="true">
          <path d="M9.547 3.062A.75.75 0 0 1 10 3.75v12.5a.75.75 0 0 1-1.264.546L4.703 13H3.167a.75.75 0 0 1-.7-.48A6.985 6.985 0 0 1 2 10c0-.887.165-1.737.468-2.52a.75.75 0 0 1 .699-.48h1.535l4.033-3.796a.75.75 0 0 1 .812-.142ZM13.28 7.22a.75.75 0 1 0-1.06 1.06L13.44 9.5l-1.22 1.22a.75.75 0 1 0 1.06 1.06l1.22-1.22 1.22 1.22a.75.75 0 1 0 1.06-1.06L15.56 9.5l1.22-1.22a.75.75 0 0 0-1.06-1.06L14.5 8.44l-1.22-1.22Z"/>
        </svg>
        <!-- Volume low -->
        <svg v-else-if="volume < 0.5" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-slate-300" aria-hidden="true">
          <path d="M9.547 3.062A.75.75 0 0 1 10 3.75v12.5a.75.75 0 0 1-1.264.546L4.703 13H3.167a.75.75 0 0 1-.7-.48A6.985 6.985 0 0 1 2 10c0-.887.165-1.737.468-2.52a.75.75 0 0 1 .699-.48h1.535l4.033-3.796a.75.75 0 0 1 .812-.142ZM12.53 6.22a.75.75 0 0 1 1.06 0 5.5 5.5 0 0 1 0 7.56.75.75 0 0 1-1.06-1.06 4 4 0 0 0 0-5.44.75.75 0 0 1 0-1.06Z"/>
        </svg>
        <!-- Volume high -->
        <svg v-else viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-slate-300" aria-hidden="true">
          <path d="M9.547 3.062A.75.75 0 0 1 10 3.75v12.5a.75.75 0 0 1-1.264.546L4.703 13H3.167a.75.75 0 0 1-.7-.48A6.985 6.985 0 0 1 2 10c0-.887.165-1.737.468-2.52a.75.75 0 0 1 .699-.48h1.535l4.033-3.796a.75.75 0 0 1 .812-.142ZM12.53 6.22a.75.75 0 0 1 1.06 0 5.5 5.5 0 0 1 0 7.56.75.75 0 0 1-1.06-1.06 4 4 0 0 0 0-5.44.75.75 0 0 1 0-1.06ZM14.652 4.097a.75.75 0 0 1 1.06 0 8 8 0 0 1 0 11.31.75.75 0 0 1-1.06-1.06 6.5 6.5 0 0 0 0-9.19.75.75 0 0 1 0-1.06Z"/>
        </svg>
      </button>

      <!-- Slider dropdown -->
      <Transition name="vol-slide">
        <div v-if="showVolume" class="volume-popup" role="tooltip">
          <span class="vol-label">{{ Math.round(volume * 100) }}%</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="volume"
            class="vol-slider"
            aria-label="Głośność"
            @input="onSliderInput"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.audio-controls {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

.audio-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  flex-shrink: 0;
}
.audio-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}
.audio-btn:focus-visible {
  outline: 2px solid rgba(196, 181, 253, 0.8);
  outline-offset: 2px;
}

/* Volume wrapper — relative so popup positions correctly */
.volume-wrapper {
  position: relative;
}

/* Floating volume popup */
.volume-popup {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(15, 12, 30, 0.95);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  min-width: 56px;
}

.vol-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
}

/* Vertical range slider */
.vol-slider {
  writing-mode: vertical-lr;
  direction: rtl;
  width: 4px;
  height: 80px;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
}

.vol-slider::-webkit-slider-runnable-track {
  width: 4px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
}

.vol-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #d946ef);
  margin-left: -5px;
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
  transition: transform 0.15s;
}

.vol-slider::-webkit-slider-thumb:hover {
  transform: scale(1.25);
}

.vol-slider::-moz-range-track {
  width: 4px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
}

.vol-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #8b5cf6, #d946ef);
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
}

/* Transition */
.vol-slide-enter-active,
.vol-slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.vol-slide-enter-from,
.vol-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
