<script setup>
import { defineModel } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    required: false,
    default: false
  },
  name: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    default: () => [
    ]
  },
  error: {
    type: String,
    default: ''
  }
})

const modelValue = defineModel()
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-medium leading-6 text-gray-900">
      <span v-if="required" class="text-red-600">*</span> {{ label }}
    </label>
    <select
      :id="id"
      :name="name"
      v-model="modelValue"
      :class="[
        'scroll-my-12 mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 sm:text-sm sm:leading-6',
        error ? 'ring-1 ring-inset ring-red-300 focus:ring-1 focus:ring-inset focus:ring-red-500' : 'ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-gray-400'
      ]"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" :id="`${name}-error`" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>