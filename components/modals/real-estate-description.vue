<template>
  <div class="mt-2 p-3">
    <h2 class="text-lg text-gray-700 font-bold">Descriere</h2>
    <p class="text-sm text-gray-500">
      <!-- Display a truncated version if showMore is false, else show full text -->
      {{ showMore ? item?.description : truncatedDescription }}
      <button
        v-if="shouldTruncate"
        @click="toggleReadMore"
        class="text-blue-500 hover:underline ml-2"
      >
        {{ showMore ? 'Arată Mai Puțin' : 'Citește Mai Mult' }}
      </button>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

// State to track if the full description is shown
const showMore = ref(false)

// Define the max length for the truncated description
const maxLength = 300

// Compute the truncated description
const truncatedDescription = computed(() => {
  return props.item?.description?.length > maxLength
    ? props.item.description.slice(0, maxLength) + '...'
    : props.item.description
})

// Check if description needs truncation
const shouldTruncate = computed(() => props.item?.description?.length > maxLength)

// Toggle function to show more or less
const toggleReadMore = () => {
  showMore.value = !showMore.value
}
</script>
