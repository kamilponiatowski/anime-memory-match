<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue: string
  label: string
  placeholder?: string
  type?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
}>()

const inputId = useId()
const errorId = computed(() => `${inputId}-error`)
const hintId = computed(() => `${inputId}-hint`)

const describedBy = computed(() => {
  const ids: string[] = []
  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.join(' ') || undefined
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="inputId" class="text-sm font-medium text-slate-300">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="text-red-400 ml-0.5">*</span>
      <span v-if="required" class="sr-only">(wymagane)</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-describedby="describedBy"
      :aria-invalid="!!error || undefined"
      :class="[
        'w-full rounded-xl border bg-slate-800 px-4 py-3 text-slate-100',
        'placeholder:text-slate-500',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-slate-900',
        error
          ? 'border-red-500 focus:ring-red-400'
          : 'border-slate-600 hover:border-slate-500',
        disabled && 'opacity-50 cursor-not-allowed',
      ]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="emit('focus')"
      @blur="emit('blur')"
    />

    <p v-if="hint && !error" :id="hintId" class="text-xs text-slate-400">
      {{ hint }}
    </p>

    <p v-if="error" :id="errorId" role="alert" class="text-xs text-red-400">
      {{ error }}
    </p>
  </div>
</template>
