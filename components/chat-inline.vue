<template>
    <div class="w-full relative">
        <div class="w-full rounded-b-lg flex justify-between relative" v-click-outside="handleClickOutside">
            <!-- Input field -->
            <div class="relative flex-1">

                <!-- Serach by image -->
                <!-- <div class="absolute left-[10px] top-1/2 -translate-y-1/2 flex items-center justify-center w-[30px] h-[30px] cursor-pointer hover:bg-gray-100 rounded-full z-10" @click="isImageModalOpen = true">
                    <Image class="size-4 text-gray-500" />
                </div> -->

                <div class="absolute top-0 left-[10px] flex items-center w-[30px] h-full">
                     <!-- Clear button -->
                    <div v-if="message?.length && !isLoading" @click="handleClearActiveMessage" class="cursor-pointer">
                        <CircleX class="size-4 text-gray-600 hover:text-red-500" />
                    </div>

                    <!-- Loader -->
                    <div v-if="isLoading">
                        <LoaderCircle class="size-4 animate-spin text-gray-600" />
                    </div>
                </div>

                <input v-model="message" @focus="inputIsFocused = true" @click="inputIsFocused = true"
                    @keyup.enter="() => handleSendMessage(message)" type="text" placeholder="Scrie ce cauți..."
                    @keydown.down.prevent="handleArrowDown" @keydown.up.prevent="handleArrowUp"
                    @keydown.enter.prevent="handleEnter" @keydown.esc="handleClickOutside" :class="[
                        'py-2.5 pl-[40px] pr-4 text-sm focus:ring-0 border-0 shadow-md w-full focus:outline-none',
                        !inputIsFocused ? 'rounded-l-lg' : '',
                    ]" ref="inputField" />

                <!-- Inline Subscribe/Unsubscribe Button -->
                <div v-if="message && message.length > 3"
                    class="absolute right-[5px] top-0 bottom-0 flex items-center pr-1 z-10">
                    <!-- Step 1: Subscribe button -->
                    <button v-if="!isSubscribedToQuery && !showFrequencySelect"
                        @click.prevent="showFrequencySelect = true"
                        class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center gap-1">
                        <Bell class="size-4 hover:animate-ring transform origin-top" />
                        Abonează-te
                    </button>

                    <!-- Step 2: Frequency selector -->
                    <div v-else-if="!isSubscribedToQuery && showFrequencySelect"
                        class="flex flex-col items-start gap-1 bg-white border p-2 rounded shadow-md text-xs w-32">
                        <label class="flex items-center gap-1 cursor-pointer">
                            <input type="radio" value="daily" v-model="selectedFrequency" />
                            Zilnic
                        </label>
                        <label class="flex items-center gap-1 cursor-pointer">
                            <input type="radio" value="weekly" v-model="selectedFrequency" />
                            Săptămânal
                        </label>
                        <button @click.prevent="handleSubscribe"
                            class="w-full mt-1 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                            Confirmă
                        </button>
                    </div>

                    <!-- Unsubscribe button -->
                    <button v-else @click.prevent="handleUnsubscribe"
                        class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition flex items-center gap-1">
                        <BellOff class="size-4 hover:animate-ring transform origin-top" />
                        Dezabonează-te
                    </button>
                </div>
            </div>

            <!-- Suggestions -->
            <ul v-if="filteredCombinedQueries.length > 0 && inputIsFocused"
                class="absolute no-scrollbar bottom-full rounded-t-md left-0 w-full bg-white border max-h-48 overflow-y-auto z-10 mb-.5">
                <li v-for="(query, index) in filteredCombinedQueries" :key="index"
                    :ref="el => suggestionRefs[index] = el" :class="[
                        'px-4 py-2 text-gray-800 cursor-pointer flex justify-between items-start transition-colors duration-150',
                        index === activeIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
                    ]" @click="handleSetActiveQueryMessage(query?.query)">
                    <div class="flex flex-col w-full">
                        <span :title="query?.query" class="font-medium text-sm truncate"
                            v-html="highlightMatch(truncateString(query?.query, 45), query.matches)"></span>
                        <span class="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <component :is="getIconComponent(query?.type)" class="size-3 text-gray-400" />
                            {{ translations[query?.type] || capitalizeFirst(query?.type) }}
                            <span v-if="query?.type === 'recent' && query.userSearches[0]?.last_searched_at"
                                class="ml-1 text-gray-400">
                                · {{ formatDistanceToNow(new Date(query.userSearches[0].last_searched_at), { addSuffix:
                                true, locale: ro }) }}
                            </span>
                            <span v-if="['suggestion', 'popular'].includes(query?.type)" class="ml-1 text-gray-400">· {{
                                query?.search_count
                                }} de căutări</span>
                        </span>
                    </div>
                </li>
            </ul>

            <!-- Button to send message -->
            <button :disabled="isQueryLoadingChat" @click="() => handleSendMessage(message)" :class="[
                'bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 flex items-center',
                inputIsFocused ? 'rounded-br-md' : 'rounded-r-md',
            ]">
                <Send class="size-6 transition-transform duration-200 hover:translate-x-0.5 hover:-translate-y-0.5"
                    v-if="!isQueryLoadingChat" />
                <LoaderCircle class="animate-spin size-6" v-else />
            </button>
        </div>

        <!-- <FormImageSearch v-if="isImageModalOpen" @close="isImageModalOpen = false" @search="handleImageSearch" /> -->
    </div>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns'
import { ro } from 'date-fns/locale';

import { useItemsStore } from '@/stores/itemsStore';
import { useChatStore } from '@/stores/chat';
import { useSubscriptionStore } from '@/stores/subscriptionStore'

import throttle from 'lodash-es/throttle';
import { capitalizeFirst, truncateString, normalizeQuery } from '../utils';
import { History, TrendingUp, Sparkles, CircleX, LoaderCircle, Bell, BellOff, Send, Image } from 'lucide-vue-next';
import Fuse from 'fuse.js'

const itemsStore = useItemsStore()
const { isQueryLoadingChat } = storeToRefs(itemsStore)

const chatStore = useChatStore()

const { notify } = useNotification();

const translations = {
    recent: 'Căutări recente',
    popular: 'Populare',
    suggestion: 'Sugestie',
};

// Importing the useSubscriptionStore
const subscriptionStore = useSubscriptionStore()

const isSubscribedToQuery = computed(() => {
    const normalized_query = normalizeQuery(message.value.trim())
    return subscriptionStore.isSubscribedToQuery(normalized_query)
})

const showFrequencySelect = ref(false)
const selectedFrequency = ref('daily')

const message = ref('');
const inputIsFocused = ref(false);
const isSelectedManually = ref(false);

const activeIndex = ref(-1);
const suggestionRefs = ref([]);

const inputField = ref(null);

// Importing the useFilterStore
const filterStore = useFilterStore()
const { activeFilters } = storeToRefs(filterStore)

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

    filterStore.resetActiveMessage()

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

    if (! query) {
        return popularWithRecentQueries
    }

    const combinedElements = [
        ...results.value,
        ...popularWithRecentQueries,
    ];

    const fuse = new Fuse(combinedElements, {
        keys: ['normalized_query'],
        ignoreDiacritics: true,

        includeMatches: true, // include match details
        findAllMatches: false, // find all matches in the string
        minMatchCharLength: 3, // minimum length of the match

        threshold: 1,           // adjust for more/less fuzziness
        includeScore: true,
        ignoreLocation: false,      // allows match anywhere in the string
    });

    const searchResults = fuse.search(query).map(result => ({
        ...result.item,
        matches: result.matches
    })).sort((a, b) => {
        const typePriority = { suggestion: 0, popular: 1, recent: 2 };
        const aPriority = typePriority[a.type] ?? 3;
        const bPriority = typePriority[b.type] ?? 3;

        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        return (a.score ?? 1) - (b.score ?? 1); // lower score = better match
    });

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

const isImageModalOpen = ref(false)

const handleImageSearch = ({ file, url }) => {
  if (file) {
    // Convert file to FormData and send to API
  } else if (url) {
    // Send image URL to backend for processing
  }
  isImageModalOpen.value = false
}

const handleSetActiveQueryMessage = (query) => {
    if (query === message.value) {
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

    if (isSelectedManually.value) return;
    throttledSuggestions(newValue);
})

const handleSendMessage = (query) => {
    // to prevent sending messages when user clicks too many times in a row
    if (isQueryLoadingChat.value) return

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

const handleSubscribe = async () => {
    try {
        const normalized_query = normalizeQuery(message.value.trim())
        await subscriptionStore.subscribe(normalized_query, selectedFrequency.value, activeFilters)
        showFrequencySelect.value = false

        notify({
            title: "Abonare reușită!",
        });
    } catch (err) {
        console.error('Subscribe error:', err)
    }
}

const handleUnsubscribe = async () => {
    try {
        const normalized_query = normalizeQuery(message.value.trim())
        await subscriptionStore.unsubscribe(normalized_query)

        notify({
            title: "Dezabonare reușită!",
        });
    } catch (err) {
        console.error('Unsubscribe error:', err)
    }
}

await searchQueryStore.fetchCombinedQueries()

if (process.client) {
    setTimeout(() => {
        if (!chatStore.isChatInlineHasBeenMounted) {
            inputField.value.focus()

            localStorage.setItem('inputHasBeenMounted', 'true');
            chatStore.isChatInlineHasBeenMounted = true
        }
    })
}

onMounted(async () => {
    scrollToBottom();
    
    setTimeout(async() => {
        await subscriptionStore.fetchSubscriptions()
    }, 100)
});
</script>