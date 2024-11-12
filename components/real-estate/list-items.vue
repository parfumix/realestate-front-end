<template>
    <ul :class="[{'sm:grid-cols-2': defaultView==chatStore.TYPE_LIST_HYBRID, 'sm:grid-cols-3': defaultView==chatStore.TYPE_LIST_ITEMS}, 'grid gap-x-4 gap-y-4 sm:gap-x-6 xl:gap-x-4 no-scrollbar overflow-y-auto pb-2']" ref="scrollable" @scroll="handleScroll">
        <RealEstateListItem v-for="item in items" :item="item" :key="item.id" class="relative" />
    </ul>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array
    }
})

let defaultView = ref(
  localStorage.getItem('defaultView') ?? 'map'
)

const filterStore = useFilterStore()
const { activeMessage, mapZoom, mapBbox } = storeToRefs(filterStore)

const chatStore = useChatStore()
const scrollable = ref(null)
const isLoading = ref(false)

const offset = ref(12)  // Track the offset for pagination
const itemsPerPage = 12  // Define items per page or fetch it from the store if dynamic

// Function to handle scroll event
const handleScroll = async() => {
  if(isLoading.value == true) return

  // Get the scroll position and height inside the div
  const scrollPosition = scrollable.value.scrollTop;
  const scrollHeight = scrollable.value.scrollHeight;
  const clientHeight = scrollable.value.clientHeight;

  // Check if the user has scrolled to the bottom of the div
  if (scrollHeight - scrollPosition <= clientHeight + 1) {
    isLoading.value = true

    const { items, mapItems } = await chatStore.handleQuery(
      activeMessage.value, filterStore.activeFilters, { zoom: mapZoom.value, bbox: mapBbox.value }, offset.value
    )
    if(! items.length) return

    offset.value += itemsPerPage
    chatStore.handlePushItems({ items, mapItems })
    isLoading.value = false
  }
};
</script>
