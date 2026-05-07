<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="app-footer" aria-label="Stopka strony">
    <span class="footer-credit">Stworzone z miłością przez&nbsp;</span>
    <a
      href="https://producktive.pl/"
      target="_blank"
      rel="noopener noreferrer"
      class="footer-brand"
      aria-label="Producktive — otwiera w nowej karcie"
    >Producktive</a>
    <span class="footer-sep" aria-hidden="true">&nbsp;·&nbsp;</span>
    <RouterLink to="/privacy" class="footer-link">Polityka prywatności</RouterLink>
  </footer>
</template>

<style scoped>
.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.15rem;
  padding: 0.45rem 1rem;
  background: rgba(6, 4, 15, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.7rem;
}

.footer-credit {
  color: rgba(100, 116, 139, 0.75);
}

/* Gradient neon text for "Producktive" */
.footer-brand {
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.68rem;
  background: linear-gradient(120deg, #c4b5fd 0%, #f0abfc 50%, #818cf8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  transition: filter 0.2s;
}
.footer-brand:hover {
  filter: drop-shadow(0 0 8px rgba(196, 181, 253, 0.65));
}

.footer-sep {
  color: rgba(71, 85, 105, 0.6);
}

.footer-link {
  color: rgba(100, 116, 139, 0.65);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover {
  color: rgba(196, 181, 253, 0.85);
}
</style>
