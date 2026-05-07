/**
 * useCookieConsent – manages GDPR cookie consent state.
 *
 * Stores the user's choice in localStorage.
 * Exposes a reactive `hasConsented` ref used by other composables
 * to gate analytics / autoplay behaviour.
 */
import { ref } from 'vue'

const STORAGE_KEY = 'anime-memory-cookie-consent'

type ConsentValue = 'accepted' | 'declined' | null

function readStorage(): ConsentValue {
  try {
    return (localStorage.getItem(STORAGE_KEY) as ConsentValue) ?? null
  } catch {
    return null
  }
}

// Module-level singleton — same ref across all call-sites
const _consent = ref<ConsentValue>(readStorage())

export function useCookieConsent() {
  const hasConsented = _consent

  function accept(): void {
    _consent.value = 'accepted'
    try { localStorage.setItem(STORAGE_KEY, 'accepted') } catch { /* private mode */ }
  }

  function decline(): void {
    _consent.value = 'declined'
    try { localStorage.setItem(STORAGE_KEY, 'declined') } catch { /* private mode */ }
  }

  function reset(): void {
    _consent.value = null
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* private mode */ }
  }

  return { hasConsented, accept, decline, reset }
}
