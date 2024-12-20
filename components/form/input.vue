<template>
  <div>
    <label :for="id" class="block text-sm font-medium leading-6 text-gray-900">
      <span v-if="required" class="text-red-600">*</span> {{ label }}
    </label>
    <div class="relative mt-2 rounded-md shadow-sm">
      <input
        :type="type"
        :name="name"
        :id="id"
        :class="[
          'block w-full rounded-md border-0 py-1.5 pr-10 sm:text-sm sm:leading-6',
          error ? 'text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500' : 'text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500'
        ]"
        :placeholder="placeholder"
        :value="model"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${name}-error` : null"
        @input="e => handleInput(e.target.value)"
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
  id: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    required: false, 
    default: false
  },
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

const model = defineModel()
const handleInput = value => {
  model.value = value
}

</script>
