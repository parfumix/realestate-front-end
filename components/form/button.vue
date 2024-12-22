<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'rounded-md px-2.5 py-1.5 shadow-sm text-sm font-semibold text-white shadow-sm',
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
