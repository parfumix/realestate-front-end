<template>
  <fieldset>
    <legend class="text-sm font-semibold leading-6 text-gray-900">
      {{ legend }}
    </legend>
    <p v-if="description" class="mt-1 text-sm leading-6 text-gray-600">
      {{ description }}
    </p>
    <div class="mt-2 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
      <div
        v-for="option in options"
        :key="option.value"
        class="flex items-center"
      >
        <input
          :id="option.value"
          :name="name"
          type="radio"
          :checked="model === option.value"
          :class="[
            'h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600',
          ]"
          @change="() => handleChange(option.value)"
        />
        <label
          :for="option.value"
          class="ml-3 block text-sm font-medium leading-6 text-gray-900"
        >
          {{ option.title }}
        </label>
      </div>
    </div>

    <p v-if="error" :id="`${name}-error`" class="mt-2 text-sm text-red-600">
        {{ error }}
    </p>
  </fieldset>
</template>

<script setup>
defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  name: {
    type: String,
    required: true,
  },
  legend: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  error: {
      type: String,
      default: ''
  }
})

const model = defineModel()
const handleChange = (value) => {
    model.value = value
}
</script>
