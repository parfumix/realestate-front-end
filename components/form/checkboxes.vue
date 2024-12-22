<template>
  <fieldset class="space-y-1">
    <p v-if="legend" class="mb-2 text-gray-500">{{ legend }}</p>

    <div v-for="(option, index) in options" :key="index" class="relative flex items-start">
      <div class="flex h-6 items-center">
        <input :id="option.value" :name="option.value" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400" :aria-describedby="`${option.value}-description`" :checked="modelValue.includes(option.value)" @change="toggleValue(option.value)" />
      </div>
      <div class="ml-2 text-sm leading-6">
        <label :for="option.value" class="font-medium text-gray-900">
          {{ option.label }}
        </label>
      </div>
    </div>

  </fieldset>
</template>

<script setup>
defineProps({
  legend: {
    type: String,
    default: null,
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const modelValue = defineModel({
  required: true,
  default: []
})

function toggleValue(name) {
  if (modelValue.value.includes(name)) {
    modelValue.value = modelValue.value.filter((v) => v !== name);
  } else {
    modelValue.value = [...modelValue.value, ...[name]]
  }
}
</script>
