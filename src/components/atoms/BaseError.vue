<script setup lang="ts">
defineProps<{ message: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    role="alert"
    class="rounded-2xl border border-red-500/30 bg-red-900/20 p-6 text-center space-y-4"
  >
    <p class="text-4xl" aria-hidden="true">⚠️</p>
    <p class="text-red-300 font-medium">{{ message }}</p>
    <button
      class="text-sm text-red-400 underline hover:text-red-300 cursor-pointer transition-colors"
      @click="emit('retry')"
    >
      Spróbuj ponownie
    </button>
  </div>
</template>
