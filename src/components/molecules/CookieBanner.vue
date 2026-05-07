<script setup lang="ts">
import { useCookieConsent } from '@/composables/useCookieConsent'
import { useSound } from '@/composables/useSound'

const { hasConsented, accept, decline } = useCookieConsent()
const { startAmbientIfOff } = useSound()

async function handleAccept() {
  accept()
  // Auto-start music after explicit user interaction (consent click)
  await startAmbientIfOff()
}
</script>

<template>
  <Transition name="cookie-slide">
    <div
      v-if="hasConsented === null"
      class="cookie-banner"
      role="alertdialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
    >
      <div class="cookie-inner">
        <div class="cookie-text">
          <p id="cookie-title" class="cookie-title">🍪 Pliki cookie</p>
          <p id="cookie-desc" class="cookie-desc">
            Używamy lokalnego storage wyłącznie do zapamiętania Twoich preferencji gry.
            Żadne dane osobowe nie są zbierane ani udostępniane.
            <a href="/privacy" class="cookie-link" target="_blank" rel="noopener">Polityka prywatności</a>
          </p>
        </div>
        <div class="cookie-actions">
          <button class="cookie-btn cookie-btn--accept" @click="handleAccept">
            Akceptuję
          </button>
          <button class="cookie-btn cookie-btn--decline" @click="decline">
            Odrzuć
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  width: min(680px, calc(100vw - 2rem));
}

.cookie-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
  background: rgba(15, 12, 30, 0.96);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
}

.cookie-text {
  flex: 1;
  min-width: 200px;
}

.cookie-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 0.2rem;
}

.cookie-desc {
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.5;
}

.cookie-link {
  color: #a78bfa;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.cookie-link:hover { color: #c4b5fd; }

.cookie-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.cookie-btn {
  padding: 0.45rem 1rem;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}
.cookie-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.cookie-btn:active { transform: translateY(0); }

.cookie-btn--accept {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff;
}

.cookie-btn--decline {
  background: rgba(255, 255, 255, 0.07);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Transition */
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.cookie-slide-enter-from,
.cookie-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
