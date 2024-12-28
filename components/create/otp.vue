<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  length: {
    type: Number,
    default: 6
  },
  disabled: {
    type: Boolean,
    default: false
  },
  autoFocus: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'complete'])

// Initialize refs
const otpValues = ref(Array(props.length).fill(''))
const inputRefs = ref([])

// Computed otp string
const otpString = computed(() => otpValues.value.join(''))

// Methods
const focusInput = (index) => {
  inputRefs.value[index]?.focus()
}

onMounted(() => {
  focusInput(0)
})

const emitChanges = () => {
  const value = otpString.value
  emit('update:modelValue', value)
  if (value.length === props.length) {
    emit('complete', value)
  }
}

const handleInput = (index, event) => {
  const value = event.target.value
  
  // Only allow digits
  if (!/^\d*$/.test(value)) {
    event.target.value = otpValues.value[index]
    return
  }

  // Update value
  otpValues.value[index] = value.slice(-1)
  emitChanges()

  // Move to next input if available
  if (value && index < props.length - 1) {
    focusInput(index + 1)
  }
}

const handleKeydown = (index, event) => {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!otpValues.value[index]) {
      event.preventDefault()
      if (index > 0) {
        otpValues.value[index - 1] = ''
        focusInput(index - 1)
        emitChanges()
      }
    } else {
      otpValues.value[index] = ''
      emitChanges()
    }
  }
  // Handle left arrow
  else if (event.key === 'ArrowLeft' && index > 0) {
    focusInput(index - 1)
  }
  // Handle right arrow
  else if (event.key === 'ArrowRight' && index < props.length - 1) {
    focusInput(index + 1)
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text')
  
  // Extract only digits
  const numbers = pastedData.replace(/\D/g, '').split('')
  
  // Fill in the values
  otpValues.value = [
    ...numbers.slice(0, props.length),
    ...Array(Math.max(0, props.length - numbers.length)).fill('')
  ]
  
  // Find next empty input or focus last one
  const nextEmptyIndex = otpValues.value.findIndex(val => !val)
  focusInput(nextEmptyIndex !== -1 ? nextEmptyIndex : props.length - 1)
  
  emitChanges()
}
</script>

<template>
  <div class="flex space-x-2">
    <template v-for="(digit, index) in length" :key="index">
      <input
        type="text"
        inputmode="numeric"
        :ref="el => inputRefs[index] = el"
        v-model="otpValues[index]"
        :disabled="disabled"
        :autofocus="autoFocus && index === 0"
        class="w-12 h-12 text-center border-2 rounded-lg text-xl 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
               outline-none transition-all duration-200
               disabled:bg-gray-100 disabled:cursor-not-allowed"
        maxlength="1"
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        @paste="handlePaste"
      />
    </template>
  </div>
</template>