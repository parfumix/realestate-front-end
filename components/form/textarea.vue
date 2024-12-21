<template>
  <div class="scroll-my-12" :id="id">
    <label
      :for="id"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
    <span v-if="required" class="text-red-600">*</span> {{ label }}
    </label>
    <div class="mt-2 flex flex-col">
      <textarea
        :id="id"
        :name="name"
        :rows="rows"
        :placeholder="placeholder"
        :class="[
          'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
          error ? 'text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500' : 'text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500',
          borderColor,
          textColor,
          focusColor
        ]"
        :value="model"
        :maxlength="maxLength"
        @input="e => handleInput(e.target.value)"
      />

      <p v-if="error" :id="`${id}-error`" class="mt-2 text-sm text-red-600">
        {{ error }}
      </p>
      <div class="mt-1 text-sm text-gray-500">
        {{ characterCount }} / {{ maxLength }}
      </div>
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
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
    default: '',
  },
  label: {
    type: String,
    default: 'Enter text',
  },
  rows: {
    type: Number,
    default: 4,
  },
  placeholder: {
    type: String,
    default: 'Type here...',
  },
  borderColor: {
    type: String,
    default: 'ring-gray-300',
  },
  textColor: {
    type: String,
    default: 'text-gray-900',
  },
  focusColor: {
    type: String,
    default: 'focus:ring-blue-600',
  },
  maxLength: {
    type: Number,
    default: 200, // Default character limit
  },
  error: {
      type: String,
      default: ''
  }
})

const model = defineModel()
const characterCount = computed(() => model.value?.length || 0)

const handleInput = value => {
  model.value = value
}
</script>
