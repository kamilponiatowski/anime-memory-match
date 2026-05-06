<script setup lang="ts">
import { useSound } from '@/composables/useSound'
import { MusicalNoteIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/solid'

const { isMuted, isAmbientOn, toggleMute, toggleAmbient } = useSound()
</script>

<template>
  <div class="flex gap-2">
    <button
      class="audio-btn"
      :aria-label="isAmbientOn ? 'Wyłącz muzykę' : 'Włącz muzykę'"
      :title="isAmbientOn ? 'Wyłącz muzykę' : 'Włącz muzykę'"
      @click="toggleAmbient"
    >
      <MusicalNoteIcon
        class="w-4 h-4 transition-colors"
        :class="isAmbientOn ? 'text-violet-300' : 'text-slate-400'"
      />
    </button>
    <button
      class="audio-btn"
      :aria-label="isMuted ? 'Włącz dźwięk' : 'Wycisz dźwięk'"
      :title="isMuted ? 'Włącz dźwięk' : 'Wycisz dźwięk'"
      @click="toggleMute"
    >
      <SpeakerXMarkIcon v-if="isMuted" class="w-4 h-4 text-slate-400" />
      <SpeakerWaveIcon v-else class="w-4 h-4 text-slate-300" />
    </button>
  </div>
</template>

<style scoped>
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
}
.audio-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}
.audio-btn:focus-visible {
  outline: 2px solid rgba(196, 181, 253, 0.8);
  outline-offset: 2px;
}
</style>
