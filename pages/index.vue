<template>
  <div class="flex flex-col h-[calc(100vh-56px)] lg:h-screen relative">
    
    <!-- Filters -->
    <div class="w-full flex justify-center border-b border-gray-200">
      <Filters class="w-full max-w-screen-xl z-[99999999]" @applyFilters="handleApplyFilters" />
    </div>

    <!-- View Mode Switcher -->
    <div class="w-full flex justify-center p-2 border-b bg-white">
      <SwitchView @change="handleSwitchView" />
    </div>

    <!-- Main content: List + Map -->
    <div class="flex flex-grow w-full flex-col md:flex-row">
      
      <!-- Left: Property List -->
      <div 
        class="overflow-y-auto flex-grow h-[calc(100vh-211px)] lg:h-[calc(100vh-155px)] no-scrollbar p-6"
        :class="[
          isHybridView ? 'w-full md:w-2/5' : isListView ? 'w-full' : 'hidden'
        ]"
      >
        <RealEstateList />
      </div>

      <!-- Right: Map -->
      <div 
        class="md:block hidden"
        :class="[
          isHybridView ? 'w-full md:w-3/5' : isMapView ? 'w-full' : 'hidden'
        ]"
      >
        <RealEstateMap @moveend="handleMapFetchItems" />
      </div>

    </div>

    <!-- Chatbox at the bottom, responsive -->
    <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full lg:w-2/6 px-4 lg:px-0 z-[500]">
      <Chat 
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

import { useChatStore } from '@/stores/chat';
import { useItemsStore } from '@/stores/itemsStore';
import { useFilterStore } from '@/stores/filters';
import { useModalStore } from '@/stores/modals';

const filterStore = useFilterStore()
const chatStore = useChatStore()
const itemsStore = useItemsStore()
const modalStore = useModalStore();

const route = useRoute();
const router = useRouter();

const { sendMessage } = useMessagesService();

import { getRomanianBounds, setHead } from '../utils'

const { defaultView } = storeToRefs(itemsStore)

const openRealEstatePropertyModal = () => {
modalStore.openModal(RealEstatePropertyModal);
}

const { 
  selectedItem
} = storeToRefs(itemsStore)

const { isModalVisible } = storeToRefs(modalStore)
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

  // adding user message to stack
  chatStore.handlePushMessage('default', { text: message, sender: 'user' })
  chatStore.handleSetPromptsByThread('default', [])

  // we're usign all romanian bbox because search can contain new locations so we need to clusterize items by whole country
  const mapFilters = { zoom: 6, bbox: getRomanianBounds(true) }
  const { reply, items, filters, prompts = [] } = await handleFetchItems(trimmedMessage, null, mapFilters, true)
  if(! items) throw new Error('No results found for' + trimmedMessage)
  
  chatStore.handleSetPromptsByThread('default', prompts)
  chatStore.handlePushMessage('default', { text: reply, sender: 'bot' })

  // apply filters automatically
  let parsedFilters = JSON.parse(JSON.stringify(filters ?? {}))

  Object.keys(parsedFilters).forEach(key => {
    if(! parsedFilters?.[key]) return
    filterStore.setActiveFilter(key, parsedFilters[key])
  });

  filterStore.setActiveMesasge(trimmedMessage)

  sendMessage(
    null, 'default', trimmedMessage, 'user', parsedFilters
  )

} catch(err) {
  chatStore.handlePushMessage('default', {
    text: err,
    sender: 'bot',
  })
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

await handleFetchItems(activeMessage.value, filterStore.activeFilters, { zoom: 6, bbox: getRomanianBounds(true) }, null, activeSorting.value)
</script>
