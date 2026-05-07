# 🃏 Anime Memory Match

A production-quality memory card game built with **Vue 3**, **TypeScript**, **Pinia**, and **Tailwind CSS**. Characters are fetched live from the free [AniList GraphQL API](https://anilist.co/graphiql). Background music streams from [listen.moe](https://listen.moe).

---

## Live features

| Feature | Details |
|---|---|
| 🎴 Dynamic cards | Characters loaded from AniList for any anime you search |
| 🎵 Background music | listen.moe anime radio — play/pause + volume slider |
| 🌟 6-star rating | Accuracy-based scoring with correct move-counting formula |
| 🍪 Cookie consent | GDPR-compliant banner; music auto-starts only on consent |
| ♿ Accessibility | ARIA labels, live regions, keyboard navigation, reduced-motion |
| 📱 Responsive | Vertically & horizontally centred on all screen sizes |

---

## Tech stack

- [Vue 3](https://vuejs.org/) — Composition API (`<script setup>`)
- [TypeScript](https://www.typescriptlang.org/) — strict mode
- [Pinia](https://pinia.vuejs.org/) — state management
- [Vue Router 4](https://router.vuejs.org/) — SPA routing with navigation guards
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styles
- [Vite](https://vitejs.dev/) — build tool
- [Vitest](https://vitest.dev/) — unit testing (29 tests, 4 suites)
- [Heroicons](https://heroicons.com/) — SVG icons
- [VueUse](https://vueuse.org/) — `useDebounceFn`

---

## Project structure

```
src/
├── api/
│   └── anilist/
│       ├── client.ts             # fetch wrapper for GraphQL
│       ├── queries.ts            # GQL query strings (SRP)
│       └── anilistRepository.ts  # data-access layer
├── assets/
│   └── main.css                  # Tailwind entry + global styles
├── components/
│   ├── atoms/                    # BaseButton, BaseInput, BaseCardSkeleton…
│   ├── molecules/                # GameCard, AudioControls, CookieBanner…
│   └── organisms/                # GameBoard, GameSetup
├── composables/
│   ├── useCards.ts               # card-building logic
│   ├── useCookieConsent.ts       # GDPR consent singleton
│   ├── useGame.ts                # game orchestration
│   ├── useAniList.ts             # AniList search facade
│   └── useSound.ts               # Web Audio API + radio singleton
├── router/
│   └── index.ts                  # routes + navigation guards
├── stores/
│   ├── animeStore.ts             # selected anime & character cache
│   └── gameStore.ts              # game state machine
├── types/
│   └── game.types.ts             # shared TypeScript interfaces & constants
├── views/
│   ├── HomeView.vue
│   ├── GameView.vue
│   ├── ResultView.vue
│   ├── PrivacyView.vue
│   └── NotFoundView.vue
└── main.ts
```

---

## Architecture principles

### SOLID
| Principle | How it applies |
|---|---|
| **S**ingle Responsibility | Each composable owns one concern: `useCards` builds cards, `useSound` manages audio, `useCookieConsent` manages consent |
| **O**pen/Closed | `DIFFICULTY_CONFIG` in `game.types.ts` lets you add difficulties without changing existing code |
| **L**iskov | `AnimePreset` is used consistently across repo, selector and result views |
| **I**nterface Segregation | `useSound` returns only the functions a component needs; components never touch raw AudioContext |
| **D**ependency Inversion | Views depend on composables, not on stores directly; composables depend on store abstractions |

### DRY
- Single `DIFFICULTY_CONFIG` drives skeleton count, grid columns, and pair count
- `anilistRepository` is the single data-access point — no raw `fetch` in components

### YAGNI
- No backend, no auth — this is a client-only portfolio game
- No complex state machine library — `GameStatus` union type is sufficient

---

## Getting started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Type-check
pnpm type-check

# Run unit tests
pnpm test:unit

# Build for production
pnpm build
```

---

## Music & streaming note

Background music is streamed live from **listen.moe** (free anime radio). This means:

- ✅ No copyright issues for a personal/portfolio project
- ✅ Free, no API key required
- ⚠️ Requires an internet connection while playing
- ⚠️ Browsers block autoplay until the user interacts with the page — that's why the music starts after you accept cookies (first explicit interaction) or when you click the ▶ play button

If the stream is unavailable, the app falls back to the K-POP stream (`listen.moe/kpop/stream`) automatically.

---

## Scoring system

Accuracy is calculated as:

```
accuracy = min(100, floor((pairs × 2 / moves) × 100))
```

A "perfect" game means you matched every pair on the first try (each card flipped exactly once). Stars are awarded as follows:

| Stars | Condition |
|---|---|
| ⭐⭐⭐⭐⭐⭐ | 100% accuracy AND fast (≤ pairs × 10s) |
| ⭐⭐⭐⭐⭐ | ≥ 90% accuracy AND not too slow |
| ⭐⭐⭐⭐ | ≥ 75% accuracy |
| ⭐⭐⭐ | ≥ 60% accuracy |
| ⭐⭐ | ≥ 40% accuracy |
| ⭐ | < 40% accuracy |

---

## Tests

```bash
pnpm test:unit
```

| Suite | Tests |
|---|---|
| `gameStore.spec.ts` | Store initialisation, flip, match, accuracy formula, reset |
| `useCards.spec.ts` | Card count per difficulty, pair uniqueness, ID uniqueness |
| `shuffle.spec.ts` | Array length, element preservation, edge cases |
| `stars.spec.ts` | All 6 star thresholds including boundary conditions |

---

## Privacy

This app stores only one item in `localStorage`:
`anime-memory-cookie-consent` — your consent choice.

No analytics, no tracking, no personal data. See [/privacy](/privacy) for details.

---

## License

MIT © 2026
