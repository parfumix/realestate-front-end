<template>
  <div class="bg-gray-100 flex flex-col items-center " style="height: calc(100vh - 40px);">

    <Filters class="w-full z-[60]" />

    <div class="flex max-w-7xl mx-auto w-full justify-center items-center px-4 sm:px-6 lg:px-8 mt-2 " style="height: calc(100vh - 150px);">
      
      <div class="sm:w-5/12	h-full sm:max-w-xl w-full bg-white shadow-xs rounded-lg flex flex-col">
        <Chat @submit="handleSendMessage" :messages="messages">
          <div class="mx-auto flex flex-wrap justify-center my-2">
            <span v-for="(prompt, index) in prompts"  @click="() => handleSelectPrompt(prompt)" :key="index" class="cursor-pointer inline-flex items-center mt-2 rounded-md bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 mr-2">
              {{ prompt }}
            </span>
          </div>
        </Chat>

      </div>

      <!-- Pass the real estate listings to the map component -->
      <div class="hidden sm:flex sm:w-7/12  h-full ml-4 z-[50] relative">
        <div v-if="jobs.length" :key="jobs.length" class="absolute inset-y-0 right-0 top-0 w-[15px] flex justify-end -mr-[50px] -mt-[30px] flex flex-col items-end justify-start space-y-2">
          <svg @click="() => handleSwitch(true)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cursor-pointer size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
          <svg @click="() => handleSwitch(false)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cursor-pointer size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>
        </div>

        <div v-if="jobs.length">
          <RealEstateMap v-if="!isListView" :key="`${randomInt}-map`" :randInt="randomInt" :items="jobs" />
          <RealEstateList v-else :key="`${randomInt}-list`" :items="jobs" />
        </div>
        <EmptyResults v-else class="w-full h-full flex flex-col justify-center items-center" />
      </div>
    </div>

  </div>
</template>

<script setup>
const filterStore = useFilterStore()
const chatStore = useChatStore()

const { jobs, messages, prompts } = storeToRefs(chatStore)

const isListView = ref(true)
const randomInt = ref(Math.random())

const handleSwitch = (mode) => {
  isListView.value = mode
  randomInt.value = Math.random()
}

const mapKey = ref(0);

const handleSelectPrompt = async(prompt) => {
  await handleSendMessage(prompt)
}

const handleSendMessage = async (message) => {
  try {
    let trimmedMessage = message.trim()
    if(! trimmedMessage) return

    // adding user message to stack
    chatStore.handlePushMessage({ text: message, sender: 'user' })
    chatStore.handleClearPrompts()

    const { reply, results: jobs, filters, prompts = [] } = await chatStore.handleQuery(trimmedMessage, {})
    if(! jobs) throw new Error('No results found for' + trimmedMessage)

    chatStore.handleSetPrompts(prompts)
    chatStore.handlePushMessage({ text: reply, sender: 'bot' })

    chatStore.handleResetJobs()
    chatStore.handlePushJobs(jobs)

    // apply filters automatically
    let parsedFilters = JSON.parse(JSON.stringify(filters))
    Object.keys(parsedFilters).forEach(key => {
      if(! parsedFilters?.[key]) return
      filterStore.setActiveFilter(key, parsedFilters[key])
    });

    // Update the items for the map and re-render it
    mapKey.value++; // Change the key to force the map to re-render

  } catch(err) {
    chatStore.handlePushMessage({
      text: err,
      sender: 'bot',
    })
  }
}
</script>
