<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { useCookieConsent } from '@/composables/useCookieConsent'

const router = useRouter()
const { reset } = useCookieConsent()

function handleResetConsent() {
  reset()
  router.push({ name: 'home' })
}
</script>

<template>
  <main class="relative min-h-dvh flex flex-col items-center justify-start px-4 py-12 overflow-hidden z-10">
    <div class="relative z-10 max-w-2xl w-full">

      <BaseButton variant="ghost" size="sm" class="mb-6" @click="router.back()">
        ← Wróć
      </BaseButton>

      <article class="prose-dark space-y-8">
        <header>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Polityka Prywatności</h1>
          <p class="text-slate-400 text-sm mt-1">Ostatnia aktualizacja: maj 2026</p>
        </header>

        <section class="policy-section">
          <h2>1. Kto jest administratorem danych?</h2>
          <p>
            Anime Memory Match jest projektem open-source stworzonym w celach
            edukacyjnych i portfolio. Nie posiada formalnego administratora danych
            w rozumieniu RODO, ponieważ nie zbiera żadnych danych osobowych.
          </p>
        </section>

        <section class="policy-section">
          <h2>2. Jakie dane zbieramy?</h2>
          <p>
            <strong>Nie zbieramy żadnych danych osobowych.</strong>
            Aplikacja nie używa Google Analytics, pikseli śledzących ani zewnętrznych
            usług analitycznych.
          </p>
          <p>Lokalnie w przeglądarce (<code>localStorage</code>) zapisujemy wyłącznie:</p>
          <ul>
            <li><code>anime-memory-cookie-consent</code> – Twój wybór dotyczący ciasteczek (<em>accepted</em> / <em>declined</em>).</li>
          </ul>
          <p>
            Dane te nie są nigdy przesyłane na serwer i możesz je usunąć w dowolnym momencie.
          </p>
        </section>

        <section class="policy-section">
          <h2>3. Zewnętrzne usługi</h2>
          <p>Aplikacja komunikuje się z następującymi zewnętrznymi API:</p>
          <ul>
            <li>
              <strong>AniList GraphQL API</strong> (<a href="https://anilist.co" target="_blank" rel="noopener noreferrer">anilist.co</a>)
              – pobieranie danych o anime i postaciach. Zapytania są anonimowe; nie przekazujemy żadnych danych użytkownika.
            </li>
            <li>
              <strong>listen.moe</strong> (<a href="https://listen.moe" target="_blank" rel="noopener noreferrer">listen.moe</a>)
              – publiczne radio anime. Strumień jest pobierany bezpośrednio przez przeglądarkę; operatorzy listen.moe mogą
              rejestrować Twój adres IP w logach serwera zgodnie z własną polityką prywatności.
            </li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>4. Pliki cookie i localStorage</h2>
          <p>
            Aplikacja nie ustawia tradycyjnych plików cookie HTTP.
            Używamy wyłącznie <code>localStorage</code> (patrz punkt 2).
            Możesz w każdej chwili wyczyścić te dane przez ustawienia przeglądarki
            lub klikając poniższy przycisk.
          </p>
          <button class="reset-btn" @click="handleResetConsent">
            Zresetuj zgodę na ciasteczka
          </button>
        </section>

        <section class="policy-section">
          <h2>5. Prawa użytkownika</h2>
          <p>
            Ponieważ nie przetwarzamy żadnych danych osobowych, prawa wynikające z RODO
            (dostęp, sprostowanie, usunięcie) nie mają praktycznego zastosowania.
            Jeśli masz pytania, otwórz zgłoszenie w repozytorium projektu na GitHub.
          </p>
        </section>

        <section class="policy-section">
          <h2>6. Zmiany polityki</h2>
          <p>
            Wszelkie zmiany będą publikowane w tym dokumencie. Data ostatniej modyfikacji
            jest widoczna u góry strony.
          </p>
        </section>
      </article>
    </div>
  </main>
</template>

<style scoped>
.policy-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.policy-section h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #c4b5fd;
}

.policy-section p,
.policy-section li {
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.7;
}

.policy-section ul {
  list-style: disc;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.policy-section code {
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 4px;
  padding: 0.1em 0.35em;
  font-size: 0.85em;
  color: #c4b5fd;
  font-family: ui-monospace, monospace;
}

.policy-section a {
  color: #a78bfa;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.policy-section a:hover { color: #c4b5fd; }

.policy-section strong { color: #e2e8f0; }

.reset-btn {
  align-self: flex-start;
  padding: 0.4rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #f87171;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.reset-btn:hover { background: rgba(239, 68, 68, 0.18); }
</style>
