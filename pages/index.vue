<template>
  <div class="bg-gray-100 flex flex-col items-center " style="height: calc(100vh - 40px);">

    <Filters class="w-full z-[50]" />

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
        <div v-if="realEstateItems.length" :key="realEstateItems.length" class="absolute inset-y-0 right-0 top-0 w-[15px] flex justify-end -mr-[50px] -mt-[30px] flex flex-col items-end justify-start space-y-2">
          <svg @click="isListView = true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cursor-pointer size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
          <svg @click="isListView = false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cursor-pointer size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>
        </div>

        <div v-if="realEstateItems.length">
          <RealEstateMap v-if="!isListView" :key="mapKey" :items="realEstateItems" />
          <RealEstateList v-else :key="realEstateItems.length" :items="realEstateItems" />
        </div>
        <EmptyResults v-else class="w-full h-full flex flex-col justify-center items-center" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { search } from '~/api/real-estate';
const filterStore = useFilterStore()

const messages = ref([
  { text: 'Bună! Cauți o locuință nouă? Asistentul nostru AI este aici să te ajute să găsești exact ce ai nevoie. Scrie preferințele tale și să începem! 🏡✨', sender: 'bot' },
]);

//TODO based on search queru and intent change prompts
let newSearchPrompts = [
  "Apartamente cu 2 dormitoare aproape de centru",
  "Case cu grădină în București",
  "Apartamente moderne în București cu parcare",
  "Proprietăți comerciale de vânzare în București",
  "Proprietăți de închiriat disponibile în București"
];
let loadMorePrompts = [
  "Arată mai multe rezultate",
  "Arată doar proprietăți recent listate"
]

const prompts = ref(newSearchPrompts)
const isListView = ref(true)

const realEstateItems = ref([]);

const mapKey = ref(0); // Key to force re-render of the map component

const handleSelectPrompt = async(prompt) => {
  prompts.value = []
  await handleSendMessage(prompt)
  prompts.value = loadMorePrompts
}

const handleSendMessage = async (message) => {
  if (message.trim()) {
    messages.value.push({ text: message, sender: 'user' });

    // Call the search function (assuming search is already defined)
    const { data, error } = await search(message);

    if (error.value) {
      messages.value.push({
        text: 'Sorry, there was an error with your search. Please try again later.',
        sender: 'bot',
      });
    } else if (data.value && data.value.results?.length > 0) {
      realEstateItems.value = data.value.results;
      const reply = data.value.reply;

      // Push the real estate listings as a separate bot message
      messages.value.push({
        realEstate: realEstateItems.value,
        sender: 'bot',
      });

        // Push the real estate listings as a separate bot message
        messages.value.push({
        text: reply,
        sender: 'bot',
      });

      // apply filters automatically
      Object.keys(data.value?.filters).forEach(key => {
        filterStore.activeFilters[key] = data.value?.filters[key]
      });

      // Update the items for the map and re-render it
      mapKey.value++; // Change the key to force the map to re-render
    } else {
      messages.value.push({
        text: `No results found for "${message}".`,
        sender: 'bot',
      });
    }}
  }
</script>
