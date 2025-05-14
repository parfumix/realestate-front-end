<template>
  <div class="flex flex-col h-[calc(100vh-56px)] lg:h-screen relative">
    
    <!-- Filters -->
    <div class="w-full flex justify-center border-b border-gray-200">
      <Filters class="w-full max-w-screen-xl z-[7777]" @applyFilters="handleApplyFilters" />
    </div>

    <!-- View Mode Switcher -->
    <div class="w-full flex justify-center p-2 border-b bg-white">
      <SwitchView @change="handleSwitchView" />
    </div>

    <!-- Main content: List + Map -->
    <div class="flex flex-grow w-full flex-col md:flex-row">
      
      <!-- Left: Property List -->
      <div 
        class="p-6"
        :class="[
          isHybridView ? 'w-full md:w-2/5' : isListView ? 'w-full' : 'hidden'
        ]"
      >
        <RealEstateListItems class="overflow-y-auto flex-grow h-[calc(100vh-211px)] lg:h-[calc(100vh-155px)] no-scrollbar" />
      </div>

      <!-- Right: Map -->
      <div 
        class="md:block hidden"
        :class="[
          isHybridView ? 'w-full md:w-3/5' : isMapView ? 'w-full' : 'hidden'
        ]"
      >
        <ClientOnly>
          <RealEstateMap @moveend="handleMapFetchItems" />
        </ClientOnly>
      </div>

    </div>

    <!-- Chatbox at the bottom, responsive -->
    <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full lg:w-3/6 px-4 lg:px-0 z-[1900]">
      <ChatInline
        @submit="handleSendMessage" 
        @resetActiveMessage="handleResetActiveMessage" 
        class="w-full my-4 rounded-lg shadow-xs" 
      />
    </div>
  </div>
</template>

<script setup>
//TODO https://flowbite.com/docs/components/skeleton/
//TODO adding translation

import RealEstatePropertyModal from '@/components/modals/real-estate-property.vue';

import { useItemsStore } from '@/stores/itemsStore';
import { useFilterStore } from '@/stores/filters';
import { useModalStore } from '@/stores/modals';
import { useSearchQueryStore } from '@/stores/searchQueryStore';


const filterStore = useFilterStore()
const itemsStore = useItemsStore()
const modalStore = useModalStore();
const searchQueryStore = useSearchQueryStore()

const route = useRoute();
const router = useRouter();

import { getRomanianBounds, setHead } from '../utils'

const defaultView = computed(() => itemsStore.defaultView);
const selectedItem = computed(() => itemsStore.selectedItem);
const isModalVisible = computed(() => modalStore.isModalVisible);

const openRealEstatePropertyModal = () => {
modalStore.openModal(RealEstatePropertyModal);
}
const { activeMessage, mapZoom, mapBbox, hasFiltersChanged, parsequery, activeSorting } = storeToRefs(filterStore)

const isListView = computed(() =>
  defaultView.value === itemsStore.TYPE_LIST_ITEMS
)
const isMapView = computed(() =>
  defaultView.value === itemsStore.TYPE_MAP_ITEMS
)
const isHybridView = computed(() =>
  defaultView.value === itemsStore.TYPE_LIST_HYBRID
)

watch(() => isModalVisible.value, newval => {
  if(! newval) itemsStore.handleResetSelectedItem()
})

/**
* In case of map while user moing map around, I have to keep items list as it is and just fetch new items from map
*/
const handleMapFetchItems = async(mapFilters) => {
  console.log('map filters', mapFilters)
  return handleFetchItems(activeMessage.value, filterStore.activeFilters, mapFilters, parsequery.value, activeSorting.value)
}

const handleFetchItems = async(trimmedMessage = null, appliedFilters = null, mapFilters = null, parsequery = null, activeSorting = null) => {
console.log('fetcing items...')

const filtersCopy = { ...appliedFilters }; 
const mapFiltersCopy = { ...mapFilters }; 

const { reply, items = null, map: { items: mapItems = [], latlngs = [] } = {}, filters, prompts = [] } = 
  await itemsStore.handleFetchItems(trimmedMessage, filtersCopy, mapFiltersCopy, null, parsequery, activeSorting) 

  itemsStore.handleResetItems()
  itemsStore.handlePushItems({ items, mapItems })

  itemsStore.handleSetLatLngs(JSON.parse(JSON.stringify(latlngs)))

  return { reply, items, mapItems, filters, prompts }
}

const handleApplyFilters = async() => {
// if user manually set filters, than we should omit user query and search through properties using just filters
handleFetchItems(activeMessage.value, filterStore.activeFilters, { zoom: mapZoom.value, bbox: mapBbox.value }, parsequery.value, activeSorting.value)
}

const handleSwitchView = async(newViewMode) => {
  itemsStore.setDefaultView(newViewMode)
}

const handleResetActiveMessage = () => {
  filterStore.resetActiveMessage()
  filterStore.resetActiveFilters()
  hasFiltersChanged.value = true

  handleFetchItems(filterStore.activeMessage, filterStore.activeFilters, { zoom: mapZoom.value, bbox: mapBbox.value }, false)
}

const handleSendMessage = async (message) => {
  try {
    let trimmedMessage = message.trim()
    if(! trimmedMessage) return

    // if is loading, do not send new query
    if(itemsStore.isQueryLoadingChat === true) return 

    // enable quuery loading state
    itemsStore.isQueryLoadingChat = true

    // we're usign all romanian bbox because search can contain new locations so we need to clusterize items by whole country
    const mapFilters = { zoom: 6, bbox: getRomanianBounds(true) }
    const { reply, items, filters, prompts = [] } = await handleFetchItems(trimmedMessage, null, mapFilters, true)
    if(! items) throw new Error('No results found for' + trimmedMessage)
    
    // apply filters automatically
    let parsedFilters = JSON.parse(JSON.stringify(filters ?? {}))

    // adding query to recent queries
    searchQueryStore.addToRecentQueries(trimmedMessage)

    Object.keys(parsedFilters).forEach(key => {
      if(! parsedFilters?.[key]) return
      filterStore.setActiveFilter(key, parsedFilters[key])
    });

    filterStore.setActiveMessage(trimmedMessage)

  } catch(err) {
    // handle error
    console.error('Error fetching items:', err)
  } finally {
    itemsStore.isQueryLoadingChat = false;
  }
}

onUnmounted(() => {
  itemsStore.handleResetItems()
})

// emulate triggering handleCloseModal
watch(() => selectedItem.value, newVal => {
if(! newVal?.id) {
  router.replace('/')
}
})

watch(() => route.params.slug, async(newSlug) => {
if(! newSlug) {
  setHead('Main page')
  return
}

const foundItem = await itemsStore.findItemBySlug(newSlug)
if(! foundItem) return

setHead(foundItem.title)
itemsStore.handleSelectItem(foundItem)
openRealEstatePropertyModal()
}, { immediate: true })

const initialFetchDone = ref(false);
if(! initialFetchDone.value) {
  await handleFetchItems(activeMessage.value, filterStore.activeFilters, { zoom: 6, bbox: getRomanianBounds(true) }, null, activeSorting.value)
  initialFetchDone.value = true
}
</script>
