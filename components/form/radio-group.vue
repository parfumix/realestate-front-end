<template>
  <fieldset>
    <legend class="text-sm font-semibold leading-6 text-gray-900">
      {{ legend }}
    </legend>
    <p v-if="description" class="mt-1 text-sm leading-6 text-gray-600">
      {{ description }}
    </p>
    <div class="mt-6 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center"
      >
        <input
          :id="item.id"
          :name="name"
          type="radio"
          :checked="value === item.id"
          :class="[
            'h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600',
          ]"
          @change="$emit('update:value', item.id)"
        />
        <label
          :for="item.id"
          class="ml-3 block text-sm font-medium leading-6 text-gray-900"
        >
          {{ item.title }}
        </label>
      </div>
    </div>
  </fieldset>
</template>

<script setup>
// Props
defineProps({
  items: {
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
  value: {
    type: String,
    default: '',
  },
})

// Emits the selected value
defineEmits(['update:value'])
</script>

<!-- <RadioGroup
  legend="Notifications"
  description="How do you prefer to receive notifications?"
  name="notification-method"
  :items="notificationOptions"
  v-model:value="selectedNotification"
/>

const notificationOptions = [
  { id: 'email', title: 'Email' },
  { id: 'sms', title: 'SMS' },
  { id: 'push', title: 'Push Notification' },
] -->