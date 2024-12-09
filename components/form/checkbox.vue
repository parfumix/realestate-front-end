<template>
  <fieldset>
    <legend v-if="legend" class="sr-only">{{ legend }}</legend>
    <div class="space-y-5">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="relative flex items-start"
      >
        <div class="flex h-6 items-center">
          <input
            :id="option.id"
            :name="option.name"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            :aria-describedby="`${option.id}-description`"
            :checked="option.checked"
            @change="$emit('update:values', toggleValue(option.name))"
          />
        </div>
        <div class="ml-3 text-sm leading-6">
          <label :for="option.id" class="font-medium text-gray-900">
            {{ option.label }}
          </label>
          <span
            :id="`${option.id}-description`"
            v-if="option.description"
            class="text-gray-500"
          >
            <span class="sr-only">{{ option.label }} </span>
            {{ option.description }}
          </span>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script setup>
// Props
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
  values: {
    type: Array,
    default: () => [],
  },
});

// Emit event to update values
defineEmits(['update:values']);

// Function to toggle values
function toggleValue(name) {
  const newValues = [...values];
  if (newValues.includes(name)) {
    return newValues.filter((v) => v !== name);
  } else {
    newValues.push(name);
    return newValues;
  }
}
</script>

<!-- 
<CheckboxGroup
    legend="Notifications"
    :options="checkboxOptions"
    v-model:values="selectedValues"
/>

const checkboxOptions = [
  {
    id: 'comments',
    name: 'comments',
    label: 'New comments',
    description: "so you always know what's happening.",
    checked: false,
  },
  {
    id: 'candidates',
    name: 'candidates',
    label: 'New candidates',
    description: 'who apply for any open postings.',
    checked: false,
  },
  {
    id: 'offers',
    name: 'offers',
    label: 'Offers',
    description: 'when they are accepted or rejected by candidates.',
    checked: false,
  },
] -->