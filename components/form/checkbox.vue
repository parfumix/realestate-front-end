<template>
  <fieldset>
    <p v-if="legend" @click="collapsible && handleCollapsible" class="mb-2 text-gray-500">{{ legend }}</p>
    <div v-show="!isCollapsed" class="space-y-5">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="relative flex items-start"
      >
        <div class="flex h-6 items-center">
          <input
            :id="option.value"
            :name="option.value"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            :aria-describedby="`${option.value}-description`"
            :checked="modelValue.includes(option.value)"
            @change="toggleValue(option.value)"
          />
        </div>
        <div class="ml-3 text-sm leading-6">
          <label :for="option.value" class="font-medium text-gray-900">
            {{ option.label }}
          </label>
          <span
            :id="`${option.value}-description`"
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
defineProps({
  legend: {
    type: String,
    default: null,
  },
  collapsible: {
    type: Boolean,
    default: false,
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
});

const isCollapsed = ref(false);

const handleCollapsible = () => {
  isCollapsed.value = !isCollapsed.value;
};

function toggleValue(name) {
    if (modelValue.value.includes(name)) {
    modelValue.value = modelValue.value.filter((v) => v !== name);
  } else {
    modelValue.value = [...modelValue.value, ...[name]]
  }
}
</script>
