<template>
    <ul class="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-4 no-scrollbar overflow-y-auto pb-2" ref="scrollable" @scroll="handleScroll">
        <RealEstateListItem v-for="item in items" :item="item" :key="item.id" class="relative" />
    </ul>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array
    }
})

const scrollable = ref(null)

// Function to handle scroll event
const handleScroll = () => {
  // Get the scroll position inside the div
  const scrollPosition = scrollable.value.scrollTop;

  // Check if the user has scrolled to the bottom of the div
  if (scrollable.value.scrollHeight - scrollable.value.scrollTop === scrollable.value.clientHeight) {
    // You can trigger additional actions here (e.g., loading more content)
  }
};
</script>
