<template>
    <div class="w-full">
        <div class="w-full rounded-b-lg flex justify-between relative" v-click-outside="handleClickOutside">
            <!-- Input field -->
            <div class="relative flex-1">
                <input v-model="message" @focus="inputIsFocused=true" @click="inputIsFocused=true"
                    @keyup.enter="() => handleSendMessage(message)" type="text" placeholder="Scrie ce cauți..."
                    @keydown.down.prevent="handleArrowDown"
                    @keydown.up.prevent="handleArrowUp"
                    @keydown.enter.prevent="handleEnter"
                    @keydown.esc="handleClickOutside"
                    :class="[
                        'py-2.5 px-4 text-sm focus:ring-0 border-0 shadow-md w-full focus:outline-none',
                        !inputIsFocused ? 'rounded-l-lg' : '',
                    ]"
                    ref="inputField"
                />

                <div v-if="message?.length && !isLoading" @click="handleClearActiveMessage"
                    class="absolute top-0 right-0 flex items-center w-[30px] h-full">
                    <CircleX class="size-4 text-gray-600" />
                </div>

                <div v-if="isLoading" class="absolute top-0 right-0 flex items-center w-[30px] h-full">
                    <svg class="animate-spin size-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </div>
            </div>

            <!-- Suggestions -->
            <ul v-if="filteredCombinedQueries.length > 0 && inputIsFocused"
                class="absolute no-scrollbar bottom-full rounded-t-md left-0 w-full bg-white border max-h-48 overflow-y-auto z-10 mb-.5">
                <li v-for="(query, index) in filteredCombinedQueries" 
                    :key="index" 
                    :ref="el => suggestionRefs[index] = el" 
                    :class="[
                        'px-4 py-2 text-gray-800 cursor-pointer flex justify-between items-start transition-colors duration-150',
                        index === activeIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
                    ]"
                    @click="handleSetActiveQueryMessage(query?.query)">
                    <div class="flex flex-col w-full">
                        <span :title="query?.query" class="font-medium text-sm truncate" v-html="highlightMatch(truncateString(query?.query, 45), query.matches)"></span>
                        <span class="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <component :is="getIconComponent(query?.type)" class="w-4 h-4 text-gray-400" />
                            {{ capitalizeFirst(query?.type) }}
                            <span v-if="query?.type === 'popular'" class="ml-1 text-gray-400">· {{ query?.search_count }}</span>
                        </span>
                    </div>
                </li>
            </ul>

            <!-- Button to send message -->
            <button :disabled="isQueryLoadingChat" @click="() => handleSendMessage(message)"
                :class="[
                    'bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 flex items-center',
                    inputIsFocused ? 'rounded-br-md' : 'rounded-r-md',
                ]"
            >
                <svg v-if="! isQueryLoadingChat" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <svg v-else class="animate-spin size-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { useItemsStore } from '@/stores/itemsStore';
import { useChatStore } from '@/stores/chat';

import throttle from 'lodash-es/throttle';
import { capitalizeFirst, truncateString, normalizeQuery } from '../utils';
import { History, TrendingUp, Sparkles, CircleX } from 'lucide-vue-next';
import Fuse from 'fuse.js'

const itemsStore = useItemsStore()
const { isQueryLoadingChat } = storeToRefs(itemsStore)

const chatStore = useChatStore()

const message = ref('');
const inputIsFocused = ref(false);
const isSelectedManually = ref(false);

const activeIndex = ref(-1);
const suggestionRefs = ref([]);

const inputField = ref(null);

// Importing the useFilterStore
const filterStore = useFilterStore()
const { activeMessage } = storeToRefs(filterStore)

// Importing the useSearchQueryStore
const searchQueryStore = useSearchQueryStore()
const { recentQueries, popularQueries, results, isLoading } = storeToRefs(searchQueryStore)

const iconMap = {
  recent: History,
  popular: TrendingUp,
  suggested: Sparkles,
};

const getIconComponent = (type) => iconMap[type] || Sparkles;

const scrollContainer = ref(null);
const emit = defineEmits(['submit', 'resetActiveMessage']);

const handleClickOutside = () => {
    inputIsFocused.value = false;
    activeIndex.value = -1;
}

const handleClearActiveMessage = () => {
    //emit('resetActiveMessage')
    message.value = ''
    inputField.value.focus()
    setTimeout(() => {
        inputIsFocused.value = true;
    }, 50);
}

const filteredCombinedQueries = computed(() => {
    const query = normalizeQuery(message.value.trim());

    const popularWithRecentQueries = [
        ...popularQueries.value,
        ...recentQueries.value,
    ];

    if(! query) {
        return popularWithRecentQueries.slice(0, 15)
    }

    const combinedElements = [
        ...results.value,
        ...popularWithRecentQueries, 
    ];

    const fuse = new Fuse(combinedElements, {
        keys: ['normalized_query'],
        ignoreDiacritics: true,
        includeMatches: true, // find all matches
        threshold: 0.35,           // adjust for more/less fuzziness
        includeScore: true,
        ignoreLocation: true,      // allows match anywhere in the string
        minMatchCharLength: 2
    });

    const searchResults = fuse.search(query).map(result => ({
        ...result.item,
        matches: result.matches
    }));

    return searchResults;
});

const highlightMatch = (text, matches = []) => {
  if (!matches.length) return text;

  // We only care about matches in the 'normalized_query' key
  const match = matches.find(m => m.key === 'normalized_query');
  if (!match || !match.indices?.length) return text;

  let result = '';
  let lastIndex = 0;

  for (const [start, end] of match.indices) {
    // Match original substring by position
    result += text.slice(lastIndex, start);
    result += `<span class="bg-yellow-200">${text.slice(start, end + 1)}</span>`;
    lastIndex = end + 1;
  }

  result += text.slice(lastIndex);
  return result;
};

const scrollToBottom = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollTo({
            top: scrollContainer.value.scrollHeight,
            behavior: "smooth",
        });
    }
};

const handleSetActiveQueryMessage = (query) => {
    if (query === activeMessage.value) {
        inputIsFocused.value = false;
        return
    }

    isSelectedManually.value = true;

    message.value = query;
    inputIsFocused.value = false;

    handleSendMessage(query);

    setTimeout(() => {
        isSelectedManually.value = false;
    }, 100);
};

const throttledSuggestions = throttle((val) => {
  searchQueryStore.fetchSuggestions(val);
}, 500);

watch(() => message.value, newValue => {
    activeIndex.value = -1;

    if(isSelectedManually.value) return;
    throttledSuggestions(newValue);
})

const handleSendMessage = (query) => {
    // to prevent sending messages when user clicks too many times in a row
    if(isQueryLoadingChat.value) return
    
    // send the message to the parent component for processing
    emit("submit", query);
};

const scrollActiveIntoView = () => {
  nextTick(() => {
    const el = suggestionRefs.value[activeIndex.value];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
};

const handleArrowDown = () => {
  if (filteredCombinedQueries.value.length === 0) return;
  activeIndex.value = (activeIndex.value + 1) % filteredCombinedQueries.value.length;
  scrollActiveIntoView();
};

const handleArrowUp = () => {
  if (filteredCombinedQueries.value.length === 0) return;
  activeIndex.value =
    (activeIndex.value - 1 + filteredCombinedQueries.value.length) % filteredCombinedQueries.value.length;
  scrollActiveIntoView();
};

const handleEnter = () => {
  if (activeIndex.value >= 0 && activeIndex.value < filteredCombinedQueries.value.length) {
    handleSetActiveQueryMessage(filteredCombinedQueries.value[activeIndex.value]?.query);
  } else {
    handleSendMessage(message.value);
  }
};

await searchQueryStore.fetchCombinedQueries()

if(process.client) {
    setTimeout(() => {
        if(! chatStore.isChatInlineHasBeenMounted) {
            inputField.value.focus()

            localStorage.setItem('inputHasBeenMounted', 'true');
            chatStore.isChatInlineHasBeenMounted = true
        }
    })
}

onMounted(async() => {
    scrollToBottom();
});
</script>