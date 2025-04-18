<template>
  <div class="scroll-my-12">
    <label :for="id" class="block text-sm font-medium leading-6 text-gray-900">
      <span v-if="required" class="text-red-600">*</span> {{ label }}
    </label>

    <div class="mt-2 flex flex-col">
      <textarea
        :id="id"
        :rows="rows"
        :placeholder="placeholder"
        :class="[
          'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
          error ? 'ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500' : 'text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500',
          borderColor,
          textColor,
          focusColor
        ]"
        :value="model"
        :maxlength="maxLength"
        @input="e => handleInput(e.target.value)"
      />

      <div :class="`flex mt-2 ${error ? 'justify-between' : 'justify-end'}`">
        <p v-if="error" :id="`${id}-error`" class="text-sm text-red-600">
          {{ error }}
        </p>

        <div class="text-sm text-gray-500 self-end">
          {{ characterCount }} / {{ maxLength }}
        </div>
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
  label: {
    type: String,
    default: 'Introduceți textul',
  },
  rows: {
    type: Number,
    default: 4,
  },
  placeholder: {
    type: String,
    default: 'Tastați aici...',
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
    default: 200,
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
