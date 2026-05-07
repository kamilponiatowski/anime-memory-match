<script setup lang="ts">
import type { GameCard } from '@/types/game.types'

interface Props {
  card: GameCard
  isDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
})

const emit = defineEmits<{
  flip: [cardId: string]
}>()

function handleClick() {
  if (props.isDisabled || props.card.isFlipped || props.card.isMatched) return
  emit('flip', props.card.id)
}
</script>

<template>
  <div
    class="card-wrapper"
    :class="{ 'is-matched': card.isMatched }"
  >
    <button
      class="card-inner"
      :class="{ 'is-flipped': card.isFlipped || card.isMatched }"
      :disabled="isDisabled || card.isMatched || card.isFlipped"
      :aria-label="
        card.isFlipped || card.isMatched
          ? `Odkryta karta: ${card.characterName} z ${card.animeTitle}`
          : 'Zakryta karta — kliknij by odkryć'
      "
      :aria-pressed="card.isFlipped || card.isMatched"
      @click="handleClick"
    >
      <!-- Rewers (tył) -->
      <div class="card-face card-back" aria-hidden="true">
        <svg class="card-back-symbol" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="toriiGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#c4b5fd"/>
              <stop offset="100%" stop-color="#f0abfc"/>
            </linearGradient>
          </defs>
          <!-- Poziomy pas górny -->
          <rect x="2" y="6" width="44" height="5" rx="2.5" fill="url(#toriiGrad)"/>
          <!-- Poziomy pas środkowy -->
          <rect x="7" y="14" width="34" height="4" rx="2" fill="url(#toriiGrad)"/>
          <!-- Słup lewy -->
          <rect x="10" y="18" width="5" height="24" rx="2.5" fill="url(#toriiGrad)"/>
          <!-- Słup prawy -->
          <rect x="33" y="18" width="5" height="24" rx="2.5" fill="url(#toriiGrad)"/>
          <!-- Nóżka lewa (lekko szersza) -->
          <rect x="9" y="6" width="7" height="3" rx="1" fill="url(#toriiGrad)" opacity=".7"/>
          <!-- Nóżka prawa -->
          <rect x="32" y="6" width="7" height="3" rx="1" fill="url(#toriiGrad)" opacity=".7"/>
        </svg>
      </div>

      <!-- Awers (przód) -->
      <div class="card-face card-front">
        <img
          :src="card.imageUrl"
          :alt="card.characterName"
          class="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div class="card-label" aria-hidden="true">
          <span class="truncate text-xs font-bold leading-tight">{{ card.characterName }}</span>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>
/* ─── Wrapper ───────────────────────────────────────────────────────────── */
.card-wrapper {
  perspective: 900px;
  height: 100%;
}

/* ─── Inner — the 3-D pivot ─────────────────────────────────────────────── */
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  padding: 0;
  background: transparent;
  /* Flip: snappy anticipation → slow reveal → quick settle */
  transition:
    transform 0.55s cubic-bezier(0.34, 1.3, 0.64, 1),
    box-shadow 0.3s ease;
  will-change: transform;
}

.card-inner:focus-visible {
  outline: 2px solid oklch(75% 0.15 200);
  outline-offset: 3px;
}

/* Hover lift — only for unflipped, enabled cards */
.card-wrapper:not(.is-matched) .card-inner:not(:disabled):not(.is-flipped):hover {
  transform: translateY(-4px) scale(1.035);
  box-shadow: 0 12px 30px rgba(139, 92, 246, 0.35);
}

/* Click press-down feel */
.card-wrapper:not(.is-matched) .card-inner:not(:disabled):active {
  transform: translateY(0) scale(0.97);
  transition-duration: 0.08s;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-inner:disabled {
  cursor: default;
}

/* ─── Faces ─────────────────────────────────────────────────────────────── */
.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
}

.card-back {
  background: linear-gradient(145deg, oklch(28% 0.07 270), oklch(18% 0.05 265));
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid oklch(38% 0.07 265);
  transition: border-color 0.2s;
}

.card-wrapper:not(.is-matched) .card-inner:not(:disabled):hover .card-back {
  border-color: oklch(58% 0.18 255);
  box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.15);
}

.card-back-symbol {
  width: clamp(1.5rem, 4vw, 2.5rem);
  height: auto;
  filter: drop-shadow(0 0 8px rgba(196, 181, 253, 0.6));
  transition: filter 0.25s;
}

.card-wrapper:not(.is-matched) .card-inner:not(:disabled):hover .card-back-symbol {
  filter: drop-shadow(0 0 14px rgba(196, 181, 253, 0.9));
}

.card-front {
  transform: rotateY(180deg);
  background: oklch(20% 0.03 260);
}

.card-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 6px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.88));
  color: white;
  text-align: center;
}

/* ─── Matched state ─────────────────────────────────────────────────────── */
.is-matched .card-inner {
  /* Persist flipped state while animating */
  transform: rotateY(180deg);
  outline: 2px solid oklch(65% 0.2 140);
  outline-offset: 2px;
  animation: matchCelebrate 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes matchCelebrate {
  0%   { transform: rotateY(180deg) scale(1); box-shadow: none; }
  30%  { transform: rotateY(180deg) scale(1.08) rotate(2deg);
         box-shadow: 0 0 24px oklch(65% 0.28 140); }
  60%  { transform: rotateY(180deg) scale(1.05) rotate(-1.5deg); }
  80%  { transform: rotateY(180deg) scale(1.02) rotate(0.5deg); }
  100% { transform: rotateY(180deg) scale(1); box-shadow: 0 0 8px oklch(60% 0.2 140); }
}

/* ─── Reduced motion ────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .card-inner {
    transition-duration: 0.01ms;
  }
  .card-wrapper:not(.is-matched) .card-inner:not(:disabled):not(.is-flipped):hover {
    transform: none;
  }
  .is-matched .card-inner {
    animation: none;
    box-shadow: 0 0 0 3px oklch(65% 0.2 140);
  }
}
</style>
