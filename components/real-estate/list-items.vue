<template>
    <div class="relative">
      <ul :class="[{'sm:grid-cols-3': defaultView==chatStore.TYPE_LIST_ITEMS && currentPageType!=='saved'}, 'sm:grid-cols-2 grid gap-x-4 gap-y-4 sm:gap-x-6 xl:gap-x-4 no-scrollbar overflow-y-auto pb-2']" ref="scrollable" @scroll="handleScroll">
          <RealEstateListItem v-for="item in items" :item="item" :key="item.id" class="relative" />
      </ul>
      <div :class="[{'right-0 -mr-14': defaultView==chatStore.TYPE_LIST_ITEMS, 'left-1/2 -ml-5 -mb-2': defaultView==chatStore.TYPE_LIST_HYBRID}, 'bottom-el absolute bottom-0 mb-2 cursor-pointer']" v-if="!noMoreValues" @click="scrollToBottom">
        <svg v-if="isScrollingDown" class="animate-spin text-black size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
    </div>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array
    },
    defaultView: {
      type: String
    }
})

const filterStore = useFilterStore()
const { activeMessage, mapZoom, mapBbox, activeFilters, parsequery, activeSorting } = storeToRefs(filterStore)

const ITEMS_PER_PAGE = 12

const chatStore = useChatStore()
const scrollable = ref(null)
const isLoading = ref(false)
const isScrollingDown = ref(false)
const noMoreValues = ref(props.items.length < ITEMS_PER_PAGE)

const offset = ref(ITEMS_PER_PAGE)  // Track the offset for pagination
const itemsPerPage = ITEMS_PER_PAGE  // Define items per page or fetch it from the store if dynamic

const route = useRoute();
const currentPageType = route.name

watch(() => [activeFilters, activeSorting], () => {
    offset.value = ITEMS_PER_PAGE
    noMoreValues.value = false
}, { deep: true })

// Function to handle scroll event
const handleScroll = async() => {
  if(isLoading.value == true || noMoreValues.value == true) return

  // Get the scroll position and height inside the div
  const scrollPosition = scrollable.value.scrollTop;
  const scrollHeight = scrollable.value.scrollHeight;
  const clientHeight = scrollable.value.clientHeight;

  // Check if the user has scrolled to the bottom of the div
  if (scrollHeight - scrollPosition <= clientHeight + 1) {
    try {
      isLoading.value = true
      isScrollingDown.value = true

      const { items } = currentPageType == 'saved'
          ? await chatStore.handleQuery(
              null, {only_saved: true}, { zoom: mapZoom.value, bbox: mapBbox.value }, offset.value
            )
          : await chatStore.handleQuery(
              activeMessage.value, filterStore.activeFilters, { zoom: mapZoom.value, bbox: mapBbox.value }, offset.value, null, parsequery.value, activeSorting.value
            )

      if(! items.length) {
        noMoreValues.value = true
        isLoading.value = false
        return
      }

      offset.value += itemsPerPage
      chatStore.handlePushItems({ items })

    } catch(err) {
      //
    } finally {
      isLoading.value = false
      isScrollingDown.value = false
    }
  }
}

// Function to scroll to the bottom of the list
const scrollToBottom = () => {
  if (scrollable.value) {
    isScrollingDown.value = true
    scrollable.value.scrollTo({
      top: scrollable.value.scrollHeight,
      behavior: 'smooth',
    });
  }
}
</script>
