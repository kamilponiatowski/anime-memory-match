<script setup lang="ts">
import { RouterView } from 'vue-router'
import StarBackground from '@/components/atoms/StarBackground.vue'
</script>

<template>
  <StarBackground />
  <RouterView v-slot="{ Component, route }">
    <Transition :name="(route.meta.transition as string) ?? 'fade'" mode="out-in">
      <component :is="Component" :key="route.name" />
    </Transition>
  </RouterView>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

