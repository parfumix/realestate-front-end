<template>
  <div>
    <label
      :for="id"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ label }}
    </label>
    <div class="mt-2 flex flex-col">
      <textarea
        :id="id"
        :name="name"
        :rows="rows"
        :placeholder="placeholder"
        :class="[
          'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
          borderColor,
          textColor,
          focusColor
        ]"
        :value="model"
        :maxlength="maxLength"
        @input="e => handleInput(e.target.value)"
      />
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
    default: 'focus:ring-indigo-600',
  },
  maxLength: {
    type: Number,
    default: 200, // Default character limit
  },
})

const model = defineModel()
const characterCount = computed(() => model.value?.length || 0)

const handleInput = value => {
  model.value = value
}
</script>
