<template>
    <div v-if="items.length && isItemsLoaded" class="relative">
      <ul :class="[{'sm:grid-cols-4': defaultView==itemsStore.TYPE_LIST_ITEMS && currentPageType!=='saved'}, 'sm:grid-cols-2 grid gap-x-4 gap-y-4 sm:gap-x-6 xl:gap-x-4 no-scrollbar overflow-y-auto pb-2']" ref="scrollable" @scroll="handleScroll">
          <RealEstateListItem v-for="item in items" :item="item" :key="item.id" class="relative" />
      </ul>
      <div :class="[{'right-0 -mr-14': defaultView==itemsStore.TYPE_LIST_ITEMS, 'left-1/2 -ml-5 -mb-2': defaultView==itemsStore.TYPE_LIST_HYBRID}, 'bottom-el absolute bottom-0 mb-2 cursor-pointer']" v-if="!noMoreValues" @click="scrollToBottom">
        <IconsSpinnerIcon v-if="isScrollingDown" :size="24" />
        <IconsLoadingIcon v-else />
      </div>
    </div>
    <EmptyResults v-else class="w-full h-full flex flex-col justify-center items-center" />
</template>

<script setup>
const itemsStore = useItemsStore()

const filterStore = useFilterStore()
const {  activeFilters, activeSorting } = storeToRefs(filterStore)

const { isScrollingDown, noMoreValues, defaultView, items, isItemsLoaded } = storeToRefs(itemsStore)

const scrollable = ref(null)

const route = useRoute();
const currentPageType = route.name

watch(() => [activeFilters, activeSorting], () => {
    itemsStore.resetPagination();
}, { deep: true })

// Function to handle scroll event
const handleScroll = async() => {
  // Get the scroll position and height inside the div
  const scrollPosition = scrollable.value.scrollTop;
  const scrollHeight = scrollable.value.scrollHeight;
  const clientHeight = scrollable.value.clientHeight;

  // Check if the user has scrolled to the bottom of the div
  if (scrollHeight - scrollPosition <= clientHeight + 1) {
    await itemsStore.loadMoreItems();
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
