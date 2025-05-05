<template>
    <div class="w-full">
        <!-- Input Field -->
        <div class="w-full rounded-b-lg flex justify-between relative" v-click-outside="handleClickOutside">
            <div class="relative flex-1">
                <input v-model="message" @focus="inputIsFocused=true" @keyup.enter="() => handleSendMessage(message, false)" type="text" placeholder="Scrie ce cauți..." class="py-2 px-4 focus:ring-0 border-0 shadow-md w-full focus:outline-none" ref="inputField" />
                <div v-if="activeMessage?.length" @click="handleClearActiveMessage" class="absolute top-0 right-0 flex items-center w-[30px] h-full">
                    <CircleX />
                </div>
            </div>

            <!-- Suggestions -->
            <ul v-if="filteredCombinedQueries.length > 0 && inputIsFocused" class="absolute no-scrollbar bottom-full left-0 w-full bg-white border max-h-48 overflow-y-auto z-10 mb-.5">
                <li v-for="(query, index) in filteredCombinedQueries" :key="index" class="px-4 py-2 text-medium text-gray-800 hover:bg-gray-200 cursor-pointer" @click="handleSetActiveQueryMessage(query?.query)">
                    {{ query?.query }}
                </li>
            </ul>

            <!-- Button to send message -->
            <button :disabled="isQueryLoadingChat" @click="() => handleSendMessage(message, false)" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center">
                <svg v-if="! isQueryLoadingChat" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <svg v-else class="animate-spin size-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { CircleX } from 'lucide-vue-next'
import { useItemsStore } from '@/stores/itemsStore';
import debounce from 'lodash-es/debounce';

const itemsStore = useItemsStore()
const { isQueryLoadingChat } = storeToRefs(itemsStore)

const message = ref('');
const inputIsFocused = ref(false);

// Importing the useFilterStore
const filterStore = useFilterStore()
const { activeMessage } = storeToRefs(filterStore)

// Importing the useSearchQueryStore
const searchQueryStore = useSearchQueryStore()
const { recentQueries, popularQueries, results } = storeToRefs(searchQueryStore)

const scrollContainer = ref(null);
const emit = defineEmits(['submit', 'resetActiveMessage']);

const handleClickOutside = () => {
    inputIsFocused.value = false;
}

const handleClearActiveMessage = () => {
    emit('resetActiveMessage')
    message.value = ''
}

const filteredCombinedQueries = computed(() => {
    const query = message.value.toLowerCase();
    const combinedElements = [...recentQueries.value, ...popularQueries.value, ...results.value];

    return combinedElements.filter((item) => {
        const itemQuery = item.query.toLowerCase();
        return itemQuery.includes(query);
    }).slice(0, 5);
})

const scrollToBottom = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollTo({
            top: scrollContainer.value.scrollHeight,
            behavior: "smooth",
        });
    }
};

const handleSetActiveQueryMessage = (query) => {
    message.value = query;
};

const debouncedFetchSuggestions = debounce((val) => {
  searchQueryStore.fetchSuggestions(val);
}, 300); // adjust delay as needed (ms)

watch(() => message.value, newValue => {
    debouncedFetchSuggestions(newValue);
})

const handleSendMessage = (query, resetMessage = true) => {
    emit("submit", query);
    if (resetMessage) {
        message.value = "";
    }
};

await searchQueryStore.fetchCombinedQueries()

onMounted(async() => {
    scrollToBottom();
});
</script>