<template>
  <div class="bg-gray-100 flex flex-col items-center " style="height: calc(100vh - 40px);">

    <Filters class="w-full z-[60]" @applyFilters="handleApplyFilters" />

    <div class="flex max-w-7xl mx-auto w-full justify-center items-center px-4 sm:px-6 lg:px-8 mt-2 " style="height: calc(100vh - 150px);">
      
      <Chat @submit="handleSendMessage" :isLoading="isQueryLoading" :messages="defaultThreadMessages" class="sm:w-5/12">
        <template #header>
          <div class="bg-blue-500 text-white py-2 px-4 rounded-t-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            <h1 class="text-md pl-2">Cauți ceva anume?</h1>
          </div>
        </template>

        <div class="mx-auto flex flex-wrap justify-center my-2">
          <span v-for="(prompt, index) in defaultThreadPrompts"  @click="() => handleSelectPrompt(prompt)" :key="`${index}+${prompt}`" class="cursor-pointer inline-flex items-center mt-2 rounded-md bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 mr-2">
            {{ prompt }}
          </span>
        </div>
      </Chat>

      <!-- Pass the real estate listings to the map component -->
      <div class="hidden sm:flex sm:w-7/12  h-full ml-4 z-[50] relative">
        <div :key="items.length" class="absolute inset-y-0 right-0 top-0 w-[15px] flex justify-center -mr-[40px] -mt-[30px] flex flex-col items-end justify-start space-y-2">
          <svg @click="() => handleSwitchView(chatStore.TYPE_LIST_ITEMS)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cursor-pointer size-7"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
          <svg @click="() => handleSwitchView(chatStore.TYPE_MAP_ITEMS)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cursor-pointer size-7"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>
        </div>

        <div class="w-full">
          <RealEstateMap v-if="defaultView==chatStore.TYPE_MAP_ITEMS" @moveend="handleMapFetchItems" />
          <RealEstateList v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import RealEstatePropertyModal from '@/components/modals/real-estate-property.vue';

const filterStore = useFilterStore()
const chatStore = useChatStore()
const modalStore = useModalStore();

const { user } = useAuthService()

let defaultView = ref(
  localStorage.getItem('defaultView') ?? 'map'
)

const openRealEstatePropertyModal = () => {
  modalStore.openModal(RealEstatePropertyModal);
}

const { 
  items, selectedItem, isQueryLoading,
 } = storeToRefs(chatStore)

const { isModalVisible } = storeToRefs(modalStore)
const { activeMessage, mapZoom, mapBbox } = storeToRefs(filterStore)

const { insertMessage } = useUserMessages()

watch(() => selectedItem.value, newVal => {
  if(newVal?.id) openRealEstatePropertyModal()
})

watch(() => isModalVisible.value, newval => {
  if(! newval) chatStore.handleResetItem()
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
const handleMapFetchItems = async(trimmedMessage = null, appliedFilters = null, mapFilters = null) => {
  const filtersCopy = { ...appliedFilters }; 
  const mapFiltersCopy = { ...mapFilters }; 

  const { mapItems } = await chatStore.handleQuery(trimmedMessage, filtersCopy, mapFiltersCopy, null, 1)

  chatStore.handleResetItems(chatStore.TYPE_MAP_ITEMS)
  chatStore.handlePushItems({ mapItems })
}

const handleFetchItems = async(trimmedMessage = null, appliedFilters = null, mapFilters = null) => {
  const filtersCopy = { ...appliedFilters }; 
  const mapFiltersCopy = { ...mapFilters }; 

  const { reply, items = null, mapItems, filters, prompts = [] } = await chatStore.handleQuery(trimmedMessage, filtersCopy, mapFiltersCopy)

  chatStore.handleResetItems()
  chatStore.handlePushItems({ items, mapItems })

  return { reply, items, mapItems, filters, prompts }
}

const handleApplyFilters = async() => {
  // if user manually set filters, than we should omit user query and search through properties using just filters
  handleFetchItems(null, filterStore.activeFilters, { mapZoom: mapZoom.value, mapBbox: mapBbox.value })
}

const handleSwitchView = async(mode) => {
  if(defaultView.value == mode) return
  
  defaultView.value = mode
  localStorage.setItem('defaultView', mode)
}

const handleSelectPrompt = async(prompt) => {
  await handleSendMessage(prompt)
}

const handleSendMessage = async (message) => {
  try {
    let trimmedMessage = message.trim()
    if(! trimmedMessage) return

    // adding user message to stack
    chatStore.handlePushMessage('default', { text: message, sender: 'user' })
    chatStore.handleSetPromptsByThread('default', [])

    const { reply, items, filters, prompts = [] } = await handleFetchItems(trimmedMessage, filterStore.activeFilters, { mapZoom: mapZoom.value, mapBbox: mapBbox.value })
    if(! items) throw new Error('No results found for' + trimmedMessage)
    
    chatStore.handleSetPromptsByThread('default', prompts)
    chatStore.handlePushMessage('default', { text: reply, sender: 'bot' })

    // apply filters automatically
    let parsedFilters = JSON.parse(JSON.stringify(filters))
    Object.keys(parsedFilters).forEach(key => {
      if(! parsedFilters?.[key]) return
      filterStore.setActiveFilter(key, parsedFilters[key])
    });

    filterStore.setActiveMesasge(trimmedMessage)

    insertMessage(
      user.value?.id, null, 'default', trimmedMessage, 'user', parsedFilters
    )

  } catch(err) {
    chatStore.handlePushMessage('default', {
      text: err,
      sender: 'bot',
    })
  }
}

handleFetchItems(activeMessage.value, filterStore.activeFilters, { mapZoom: mapZoom.value, mapBbox: mapBbox.value })
</script>
