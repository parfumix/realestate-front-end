<template>
    <div class="relative flex items-start">
      <div class="flex h-6 items-center">
        <input 
          :id="id" 
          type="checkbox" 
          :class="['h-4 w-4 rounded focus:ring-blue-400', error ? 'border-red-600 text-red-600 focus:ring-red-400' : 'border-gray-300']" 
          :checked="modelValue" 
          @change="toggleValue" 
        />
      </div>
      <div class="ml-2 text-sm leading-6">
        <label :for="id" :class="['font-medium ', error ? 'text-red-500' : 'text-gray-900']">
          <slot>
            {{ label }}
          </slot>
        </label>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    id: {
        type: String,
        required: true
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    error: {
        type: String,
        required: false,
        default: null,
    },
  });

  const modelValue = defineModel({
    required: true,
    default: false,
  });
  
  function toggleValue() {
    modelValue.value = !modelValue.value;
  }
  </script>
  