<template>
  <button
    :type="type"
    :class="[
      'rounded px-2 py-1 text-xs font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      backgroundColor,
      textColor,
      hoverColor,
      focusColor,
    ]"
    @click="handleClick"
  >
    {{ text }}
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
  backgroundColor: {
    type: String,
    default: 'bg-indigo-600',
  },
  textColor: {
    type: String,
    default: 'text-white',
  },
  hoverColor: {
    type: String,
    default: 'hover:bg-indigo-500',
  },
  focusColor: {
    type: String,
    default: 'focus-visible:outline-indigo-600',
  },
})

// Emits click event
defineEmits(['click'])

// Method to handle click
function handleClick(event) {
  // Emit click event to parent
  emit('click', event)
}
</script>

<!-- <CustomButton
    text="Click Me"
    :backgroundColor="'bg-blue-600'"
    :hoverColor="'hover:bg-blue-500'"
    :focusColor="'focus-visible:outline-blue-600'"
    @click="handleClick"
  /> -->