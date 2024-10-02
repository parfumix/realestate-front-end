<template>
  <div class="h-screen bg-gray-100 flex flex-col items-center">

    <Filters class="w-full z-50" />

    <div class="flex max-w-7xl mx-auto w-full justify-center items-center px-4 sm:px-6 lg:px-8 mt-2 mb-6" style="height: calc(100vh - 150px);">
      
      <div class="sm:w-5/12	h-full sm:max-w-xl w-full bg-white shadow-lg rounded-lg flex flex-col">
        <Chat @submit="handleSendMessage" :messages="messages">
          <div class="mx-auto flex flex-wrap justify-center my-2">
            <span v-for="(prompt, index) in prompts"  @click="() => handleSelectPrompt(prompt)" :key="index" class="cursor-pointer inline-flex items-center mt-2 rounded-md bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 mr-2">
              {{ prompt }}
            </span>
          </div>
        </Chat>

      </div>

      <!-- Pass the real estate listings to the map component -->
      <div class="hidden sm:flex sm:w-7/12  h-full ml-2 z-30">
        <RealEstateMap :key="mapKey" :items="realEstateItems" />
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

const prompts = ref(newSearchPrompts);

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
