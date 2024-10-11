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

const chatStore = useChatStore()
const scrollable = ref(null)

// Function to handle scroll event
const handleScroll = async() => {
  // Get the scroll position and height inside the div
  const scrollPosition = scrollable.value.scrollTop;
  const scrollHeight = scrollable.value.scrollHeight;
  const clientHeight = scrollable.value.clientHeight;

  // Check if the user has scrolled to the bottom of the div
  if (scrollHeight - scrollPosition <= clientHeight + 1) {
    const { results: items } = await chatStore.handleLoadMore()
    if(! items) return

    chatStore.handlePushItems(items)
  }
};
</script>
