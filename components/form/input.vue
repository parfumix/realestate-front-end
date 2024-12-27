<template>
  <div>
    <label :for="id" class="block text-sm font-medium leading-6 text-gray-900">
      <span v-if="required" class="text-red-600">*</span> {{ label }}
    </label>
    <div class="mt-2 flex rounded-md shadow-sm">
      <div class="relative flex flex-grow items-stretch focus-within:z-10">
        <div class="absolute inset-y-0 left-0 flex items-center">
          <slot name="prefix"></slot>
        </div>
        <input
          :type="type"
          :name="name"
          :disabled="disabled"
          :id="id"
          :class="[
            inputClass,
            error ? 'ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-1 focus:ring-inset focus:ring-red-500' : ' ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-gray-400'
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
      <slot name="actions"></slot>
    </div>
    <p v-if="error" :id="`${name}-error`" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ExclamationCircleIcon } from '@heroicons/vue/20/solid'
import { twMerge } from 'tailwind-merge';

// Props
const props = defineProps({
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
  disabled: {
    type: Boolean,
    required: false
  },
  required: {
    type: Boolean,
    required: false, 
    default: false
  },
  inputClass: {
    type: [String, Array],
    default: ''
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

const inputClass = computed(() => {
    return twMerge('scroll-my-12 block w-full rounded-md border-0 py-1.5 pr-10 sm:text-sm sm:leading-6 text-gray-900', props.inputClass);
})

const model = defineModel()
const handleInput = value => {
  model.value = value
}

</script>

<style scoped>
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}
</style>