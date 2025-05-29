<template>
  <ChatInline
    @submit="handleSendMessage" 
    class="w-full my-4 rounded-lg shadow-xs" 
  />
</template>

<script setup>
const handleSendMessage = async (message) => {
  try {
    let trimmedMessage = message.trim()
    if(! trimmedMessage) return

    // we're usign all romanian bbox because search can contain new locations so we need to clusterize items by whole country
    const { reply, items, filters, prompts = [] } = await handleFetchItems(trimmedMessage, null, null, true)
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
</script>
