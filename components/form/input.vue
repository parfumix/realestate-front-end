<template>
  <div>
    <label :for="name" class="block text-sm font-medium leading-6 text-gray-900">
      {{ label }}
    </label>
    <div class="relative mt-2 rounded-md shadow-sm">
      <input
        :type="type"
        :name="name"
        :id="name"
        :class="[
          'block w-full rounded-md border-0 py-1.5 pr-10 sm:text-sm sm:leading-6',
          error ? 'text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500' : 'text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500'
        ]"
        :placeholder="placeholder"
        :value="value"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${name}-error` : null"
        @input="$emit('update:value', $event.target.value)"
      />
      <div v-if="error" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
      </div>
    </div>
    <p v-if="error" :id="`${name}-error`" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ExclamationCircleIcon } from '@heroicons/vue/20/solid'

// Props
defineProps({
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

// Emit event
defineEmits(['update:value'])
</script>

<!-- 
<FormInput
  label="Email"
  type="email"
  name="email"
  placeholder="you@example.com"
  v-model:value="email"
  :error="emailError"
/> -->