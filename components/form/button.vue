<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'rounded px-2 py-1 text-xs font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      backgroundColor,
      textColor,
      hoverColor,
      focusColor,
    ]"
    @click="handleClick"
  >
  <slot>
    {{ text }}
  </slot>
  </button>
</template>

<script setup>
// Props
defineProps({
  text: {
    type: String,
    default: 'Button',
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  backgroundColor: {
    type: String,
    default: 'bg-blue-600',
  },
  textColor: {
    type: String,
    default: 'text-white',
  },
  hoverColor: {
    type: String,
    default: 'hover:bg-blue-500',
  },
  focusColor: {
    type: String,
    default: 'focus-visible:outline-blue-600',
  },
})

// Emits click event
const emit = defineEmits(['onClick'])

// Method to handle click
function handleClick() {
  emit('onClick')
}
</script>

<!-- <CustomButton
    text="Click Me"
    :backgroundColor="'bg-blue-600'"
    :hoverColor="'hover:bg-blue-500'"
    :focusColor="'focus-visible:outline-blue-600'"
    @click="handleClick"
  /> -->