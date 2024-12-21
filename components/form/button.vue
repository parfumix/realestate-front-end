<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'rounded px-2 py-1 text-xs font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
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
  }
})

const emit = defineEmits(['onClick'])

function handleClick() {
  emit('onClick')
}
</script>
