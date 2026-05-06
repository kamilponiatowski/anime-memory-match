<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/atoms/BaseButton.vue'

const router = useRouter()
</script>

<template>
  <main class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="text-center space-y-6">
      <p class="text-8xl" aria-hidden="true">🌸</p>
      <h1 class="text-4xl font-extrabold text-slate-100">404</h1>
      <p class="text-slate-400 text-lg">Tej strony nie ma w tym świecie anime...</p>
      <BaseButton variant="primary" @click="router.push({ name: 'home' })">
        Wróć do menu
      </BaseButton>
    </div>
  </main>
</template>
