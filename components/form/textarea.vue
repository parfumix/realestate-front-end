<template>
  <div>
    <label
      :for="id"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ label }}
    </label>
    <div class="mt-2">
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
        :value="value"
        @input="$emit('update:value', $event.target.value)"
      />
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
  value: {
    type: String,
    default: '',
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
})

// Emits value update
defineEmits(['update:value'])
</script>

<!-- <TextArea
  id="comment"
  name="comment"
  label="Add your comment"
  rows="5"
  placeholder="Write your comment here..."
  v-model:value="comment"
/> -->