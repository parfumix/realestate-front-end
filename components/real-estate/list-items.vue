<template>
    <div class="w-full h-full flex flex-col" ref="scrollable" @scroll="handleScroll">
      <div v-if="items && items.length && isItemsLoaded" class="relative">
        <div :class="`${gridClasses} scroll-smooth`">
            <RealEstateListItem v-for="(item, index) in items" :item="item" :key="item.id || index" class="relative" />
        </div>
        <div :class="loaderElClass" v-if="!noMoreValues" @click="scrollToBottom">
          <IconsArrowDown v-if="isScrollingDown" :size="24" />
          <IconsLoadingIcon v-else />
        </div>
      </div>
      <EmptyResults v-else :class="['w-full h-full flex flex-col justify-center items-center']" />
    </div>
</template>

<script setup>
import { useItemsStore } from '@/stores/itemsStore';
import { useFilterStore } from '@/stores/filters';

const itemsStore = useItemsStore()
const filterStore = useFilterStore()

const { activeFilters, activeSorting, mapZoom, mapBbox, activeMessage, parsequery } = storeToRefs(filterStore)
const { isScrollingDown, noMoreValues, defaultView, items, isItemsLoaded, resetTrigger } = storeToRefs(itemsStore)

const scrollable = ref(null)

const route = useRoute();
const currentPageType = route.name;

// Computed property for grid classes
const gridClasses = computed(() => {
  const baseClasses = 'sm:grid-cols-2 grid gap-x-4 gap-y-4 sm:gap-x-6 xl:gap-x-4 no-scrollbar overflow-y-auto pb-2';
  if (defaultView.value === itemsStore.TYPE_LIST_ITEMS && currentPageType !== 'saved') {
    return `sm:grid-cols-4 ${baseClasses}`;
  }
  return baseClasses;
});

// Function to scroll to the bottom of the list
const loaderElClass = computed(() => {
  return {
    'right-0 -mr-14': defaultView.value === itemsStore.TYPE_LIST_ITEMS,
    'left-1/2 -ml-5 -mb-2': defaultView.value === itemsStore.TYPE_LIST_HYBRID,
    'bottom-el absolute bottom-0 mb-2 cursor-pointer': true,
  };
})

watch(resetTrigger, () => {
  itemsStore.resetPagination();
  
  setTimeout(() => {
    scrollToTop();
  }, 100);
})

// Function to handle scroll event
const handleScroll = async() => {
  // Get the scroll position and height inside the div
  const scrollPosition = scrollable.value.scrollTop;
  const scrollHeight = scrollable.value.scrollHeight;
  const clientHeight = scrollable.value.clientHeight;

  // Check if the user has scrolled to the bottom of the div
  if (scrollHeight - scrollPosition <= clientHeight + 1) {
    await itemsStore.loadMoreItems({ 
      activeMessage, activeFilters, activeSorting, mapZoom, mapBbox, parsequery
     });
  }
}

// Function to scroll to the top of the list
const scrollToTop = () => {
  if (scrollable.value) {
    isScrollingDown.value = false
    scrollable.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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

<style scoped>
.scroll-smooth {
  scroll-behavior: smooth;
}
</style>