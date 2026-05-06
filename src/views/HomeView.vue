<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GameSetup from '@/components/organisms/GameSetup.vue'
import AudioControls from '@/components/molecules/AudioControls.vue'
import { useGame } from '@/composables/useGame'
import { useSound } from '@/composables/useSound'
import type { Difficulty } from '@/types/game.types'

const router = useRouter()
const { startGame } = useGame()
const { startAmbientIfOff } = useSound()

// Autostart muzyki przy pierwszej interakcji użytkownika
onMounted(() => {
  const handler = () => {
    startAmbientIfOff()
    window.removeEventListener('pointerdown', handler)
    window.removeEventListener('keydown', handler)
  }
  window.addEventListener('pointerdown', handler, { once: true, passive: true })
  window.addEventListener('keydown', handler, { once: true, passive: true })
})

async function handleStart(difficulty: Difficulty) {
  await startGame(difficulty)
  router.push({ name: 'game' })
}
</script>

<template>
  <main class="relative min-h-screen flex flex-col items-center justify-center px-4 py-10 overflow-hidden z-10">
    <a href="#main-content" class="skip-link">Przejdź do treści</a>

    <!-- Ambient blobs -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="blob blob-violet"></div>
      <div class="blob blob-pink"></div>
      <div class="blob blob-blue"></div>
    </div>

    <!-- Audio controls — prawy górny róg -->
    <div class="absolute top-4 right-4 z-20">
      <AudioControls />
    </div>

    <div id="main-content" class="relative z-10 w-full max-w-xl flex flex-col gap-8">
      <!-- Hero -->
      <header class="text-center flex flex-col items-center gap-3">
        <div class="hero-icon" aria-hidden="true">
          <!-- SVG playing card -->
          <svg viewBox="0 0 48 68" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]">
            <rect x="1" y="1" width="46" height="66" rx="6" fill="rgba(255,255,255,0.05)" stroke="url(#cardGrad)" stroke-width="1.5"/>
            <text x="7" y="20" font-size="13" fill="url(#cardGrad)" font-family="serif">♠</text>
            <text x="24" y="42" font-size="22" fill="url(#cardGrad)" text-anchor="middle" font-family="serif" font-weight="bold">A</text>
            <text x="41" y="60" font-size="13" fill="url(#cardGrad)" text-anchor="middle" transform="rotate(180,24,56)" font-family="serif">♠</text>
            <defs>
              <linearGradient id="cardGrad" x1="0" y1="0" x2="48" y2="68" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#c4b5fd"/>
                <stop offset="100%" stop-color="#f0abfc"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Anime Memory
          <span class="text-gradient">Match</span>
        </h1>
        <p class="text-slate-300/80 text-base max-w-xs leading-relaxed">
          Odkrywaj postacie z ulubionych anime i znajdź wszystkie pary!
        </p>
      </header>

      <!-- Glass card z formularzem -->
      <div class="glass-card px-6 py-8 sm:px-8">
        <GameSetup @start="handleStart" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.skip-link {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.skip-link:focus {
  position: fixed;
  left: 1rem;
  top: 1rem;
  width: auto;
  height: auto;
  overflow: visible;
  z-index: 50;
  background: oklch(55% 0.22 250);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  outline: 2px solid white;
}

.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 20px 60px rgba(0, 0, 0, 0.5);
}

.text-gradient {
  background: linear-gradient(135deg, #c4b5fd, #f0abfc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-icon {
  animation: floatIcon 4s ease-in-out infinite;
}

@keyframes floatIcon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Ambient blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}
.blob-violet {
  width: 500px; height: 400px;
  background: oklch(50% 0.22 280);
  opacity: 0.22;
  top: -150px; left: -100px;
}
.blob-pink {
  width: 350px; height: 350px;
  background: oklch(58% 0.22 330);
  opacity: 0.18;
  bottom: -80px; right: -60px;
}
.blob-blue {
  width: 280px; height: 280px;
  background: oklch(60% 0.2 230);
  opacity: 0.14;
  bottom: 30%; left: 50%;
  transform: translateX(-50%);
}

@media (prefers-reduced-motion: reduce) {
  .hero-icon { animation: none; }
}
</style>
