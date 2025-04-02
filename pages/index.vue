<template>
  <div class="bg-gray-100 flex flex-col items-center " style="height: calc(100vh - 0px);">

    <Filters v-if="currentPageType!='saved'" class="w-full z-[60]" @applyFilters="handleApplyFilters" />
    <Heading v-if="currentPageType=='saved'" class="w-full h-[53px]" />

    <div class="flex max-w-7xl mx-auto w-full justify-center items-center px-4 sm:px-6 lg:px-8 mt-2 relative" style="height: calc(100vh - 67px);">
      <!-- it's for saved page only -->
      <RealEstateList :defaultView="defaultView" v-if="defaultView==itemsStore.TYPE_LIST_HYBRID || currentPageType=='saved'" class="sm:w-5/12" />

      <Chat v-if="currentPageType!='saved'" :defaultView="defaultView" @submit="handleSendMessage" @resetActiveMessage="handleResetActiveMessage" :isLoading="isQueryLoading" :messages="defaultThreadMessages" :class="{'sm:w-5/12': defaultView!=itemsStore.TYPE_LIST_HYBRID, 'absolute h-6 z-[100] bottom-5': defaultView==itemsStore.TYPE_LIST_HYBRID}">
        <template v-if="defaultView!=itemsStore.TYPE_LIST_HYBRID" #header>
          <div class="bg-blue-500 text-white py-2 px-4 rounded-t-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            <h1 class="text-md pl-2">Cauți ceva anume?</h1>
          </div>
        </template>

        <div v-if="defaultView!=itemsStore.TYPE_LIST_HYBRID" class="mx-auto flex flex-wrap justify-center my-2">
          <span v-for="(prompt, index) in defaultThreadPrompts"  @click="() => handleSelectPrompt(prompt)" :key="`${index}+${prompt}`" class="cursor-pointer inline-flex items-center mt-2 rounded-md bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 mr-2">
            {{ prompt }}
          </span>
        </div>
      </Chat>

      <!-- Pass the real estate listings to the map component -->
      <div class="hidden sm:flex sm:w-7/12  h-full ml-4 z-[50] relative">
        <div v-if="currentPageType!='saved'" :key="items.length" class="absolute inset-y-0 right-0 top-0 w-[15px] flex justify-center -mr-[40px] -mt-[30px] flex flex-col items-end justify-start space-y-2">
          <svg @click="() => handleSwitchView(itemsStore.TYPE_LIST_ITEMS)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cursor-pointer size-7"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
          <svg @click="() => handleSwitchView(itemsStore.TYPE_MAP_ITEMS)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cursor-pointer size-7"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>
          <svg @click="() => handleSwitchView(itemsStore.TYPE_LIST_HYBRID)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cursor-pointer size-7"><path stroke-linecap="round" stroke-linejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" /></svg>
        </div>

        <div class="w-full">
          <RealEstateMap :defaultView="defaultView" v-show="defaultView==itemsStore.TYPE_MAP_ITEMS || defaultView==itemsStore.TYPE_LIST_HYBRID || currentPageType=='saved'" @moveend="handleMapFetchItems" />
          <RealEstateList :currentPageType="currentPageType" :defaultView="defaultView" v-show="defaultView==itemsStore.TYPE_LIST_ITEMS && currentPageType!='saved'" />
        </div>
      </div>
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

const currentPageType = ref(null)

import { getRomanianBounds, setHead } from '../utils'

let defaultView = ref(
  localStorage.getItem('defaultView') ?? 'hybrid'
)

const openRealEstatePropertyModal = () => {
  modalStore.openModal(RealEstatePropertyModal);
}

const { 
  items, isQueryLoading, selectedItem
 } = storeToRefs(itemsStore)

const { isModalVisible } = storeToRefs(modalStore)
const { activeMessage, mapZoom, mapBbox, hasFiltersChanged, parsequery, activeSorting } = storeToRefs(filterStore)

watch(() => isModalVisible.value, newval => {
  if(! newval) itemsStore.handleResetSelectedItem()
})

const defaultThreadMessages = computed(() => {
  return chatStore.handleGetMessagesByThread('default')
})

const defaultThreadPrompts = computed(() => {
  return chatStore.handleGetPromptsByThread('default')
})

/**
 * In case of map while user moing map around, I have to keep items list as it is and just fetch new items from map
 */
const handleMapFetchItems = async(mapFilters) => {
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

const handleSwitchView = async(mode) => {
  if(defaultView.value == mode) return
  
  defaultView.value = mode
  localStorage.setItem('defaultView', mode)
}

const handleSelectPrompt = async(prompt) => {
  await handleSendMessage(prompt)
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
    const { reply, items, filters, prompts = [] } = await handleFetchItems(trimmedMessage, null, mapFilters)
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

watch(() => route.name, async(currentPageName) => {
  currentPageType.value = currentPageName

  // if(currentPageName == 'saved') handleFetchItems(null, { only_saved: true }, null)

  if(currentPageName == 'index') {
    await handleFetchItems(activeMessage.value, filterStore.activeFilters, { zoom: 6, bbox: getRomanianBounds(true) }, null, activeSorting.value)
  }
}, { immediate: true })
</script>
