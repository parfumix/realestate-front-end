<template>
    <div class="w-full relative">
        <div class="w-full rounded-b-lg flex justify-between relative" v-click-outside="handleClickOutside">
            <!-- Input field -->
            <div class="relative flex items-center w-full shadow-md bg-white">

                <!-- Search Icon -->
                <div class="absolute top-0 left-[5px] flex items-center w-[30px] h-full">
                    <Search class="ml-2 size-4 text-gray-600" />
                </div>

                <input v-model="message" @focus="inputIsFocused = true" @click="inputIsFocused = true"
                    @keyup.enter="() => handleSendMessage(message)" type="text" placeholder="Scrie ce cauți..."
                    @keydown.down.prevent="handleArrowDown" @keydown.up.prevent="handleArrowUp"
                    @keydown.enter.prevent="handleEnter" @keydown.esc="handleClickOutside" :class="[
                        'py-2.5 pl-[40px] pr-4 text-sm focus:ring-0 border-0 flex-grow focus:outline-none',
                        !inputIsFocused ? 'rounded-l-lg' : '',
                    ]" ref="inputField" />

                <!-- Inline Subscribe/Unsubscribe Button -->
                <div v-if="message && message.length > 3" class="absolute right-[45px] top-0 bottom-0 flex items-center pr-1 z-10">

                    <div class="mr-2">
                        <!-- Clear button -->
                        <div v-if="message?.length && !isLoading" @click="handleClearActiveMessage" class="cursor-pointer">
                            <CircleX class="size-4 text-gray-600 hover:text-red-500" />
                        </div>

                        <!-- Loader -->
                        <div v-if="isLoading">
                            <LoaderCircle class="size-4 animate-spin text-gray-600" />
                        </div>
                    </div>

                    <!-- Step 1: Subscribe button -->
                    <button v-if="!isSubscribedToQuery && !showFrequencySelect" @click.prevent.stop="handleShowFrequencySelector" class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center gap-1">
                        <Bell class="size-4 hover:animate-ring transform origin-top" />
                        Abonează-te
                    </button>

                    <!-- Step 2: Frequency selector -->
                    <div v-click-outside="handleClickOutsideSubscribeSelector" v-else-if="!isSubscribedToQuery && showFrequencySelect" class="flex flex-col fixed right-0 bottom-[10px] items-start gap-1 bg-white border p-2 rounded shadow-md text-xs w-32">
                        <label class="flex items-center gap-1 cursor-pointer">
                            <input type="radio" value="instant" v-model="selectedFrequency" />
                            Instant
                        </label>
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
                    <button v-else @click.prevent="handleUnsubscribe" class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition flex items-center gap-1">
                        <BellOff class="size-4 hover:animate-ring transform origin-top" />
                        Dezabonează-te
                    </button>
                </div>

                 <!-- Search by image -->
                <div class="flex items-center justify-center w-[50px] h-full bg-white cursor-pointer " @click="isImageModalOpen = true">
                    <Camera class="size-5 text-gray-400 hover:text-gray-500 duration-300" />
                </div>
            </div>

            <!-- Autocomplete -->
            <div v-if="inputIsFocused" class="absolute w-full bottom-full rounded-t-md left-0 bg-white border-0 max-h-48 overflow-y-auto z-10 mb-.5">

                <!-- Popular or Search suggestions -->
                <ul v-if="filteredCombinedQueries.length > 0 && inputIsFocused">
                    <li v-for="(query, index) in filteredCombinedQueries" :key="index" :ref="el => suggestionRefs[index] = el" :class="['px-4 py-2 text-gray-800 cursor-pointer flex justify-between items-start transition-colors duration-150', index === activeIndex ? 'bg-blue-100' : 'hover:bg-blue-50']" @click="handleSetActiveQueryMessage(query?.query)">
                        <div class="flex flex-col w-full">
                            <span :title="query?.query" class="font-medium text-sm" v-html="truncateString(highlightMatchUsingNormalized(query?.query, query?.normalized_query, query.matches), 160)"></span>
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

                <div v-if="filteredCombinedQueries.length === 0 && !isLoading" class="px-4 py-2 text-gray-500 text-sm flex items-center gap-1">
                    Se pare că nu am găsit rezultate <Frown class="size-4 text-gray-400 inline" />
                </div>

                <!-- Recent searches -->
                 <div class="p-2" v-if="filteredRecentQueries.length > 0">
                   
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-sm font-semibold text-gray-700">Recent searches</h2>
                        <button
                            class="text-sm text-gray-500 hover:text-red-500 transition-colors duration-150"
                            @click="handleDeletRecentQuries"
                            title="Șterge căutările recente"
                        >
                            Șterge căutările
                        </button>
                    </div>
                    
                    <div class="flex flex-wrap gap-2">
                    <div
                        v-for="(query, index) in filteredRecentQueries"
                        :key="index"
                        @click="handleSetActiveQueryMessage(query?.query)"
                        class="flex items-center px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                    >
                        <span :title="query?.query" class="font-medium text-sm cursor-pointer" v-html="truncateString(highlightMatchUsingNormalized(query?.query, query?.normalized_query, query.matches), 160)"></span>
                       <Search class="ml-2 size-4 text-gray-600" />
                    </div>
                    </div>
                </div>
            </div>
        </div>

        <FormImageSearch v-if="isImageModalOpen" @close="isImageModalOpen = false" @search="handleImageSearch" />
    </div>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns'
import { ro } from 'date-fns/locale';

import { useItemsStore } from '@/stores/itemsStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore'

import { throttle } from 'lodash';

import { capitalizeFirst, truncateString, normalizeQuery } from '../utils';
import { History, TrendingUp, Sparkles, CircleX, LoaderCircle, Bell, BellOff, Camera, Search, Frown } from 'lucide-vue-next';
import Fuse from 'fuse.js'

const itemsStore = useItemsStore()
const { isQueryLoadingChat } = storeToRefs(itemsStore)

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
const isImageModalOpen = ref(false)

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
    filterStore.resetActiveMessage()

    message.value = ''
    inputField.value.focus()
    setTimeout(() => {
        inputIsFocused.value = true;
    }, 50);
}

const filteredRecentQueries = computed(() => {
     const query = normalizeQuery(message.value.trim());

    if (! query) {
        return recentQueries.value
    }

    const fuse = new Fuse(recentQueries.value, {
        keys: ['normalized_query'],
        isCaseSensitive: false,
        ignoreDiacritics: true,
        shouldSort: true,     // sorting them manually

        includeMatches: true,  // include match details
        findAllMatches: false, // find all matches in the string
        minMatchCharLength: 3, // minimum length of the match

        threshold: 0.3,          // adjust for more/less fuzziness
        includeScore: true,
        ignoreLocation: false, // allows match anywhere in the string
    });

    const searchResults = fuse.search(query).map(result => {
        return {
            ...result.item,
            score: result.score,
            matches: result.matches,
        };
    })

    return searchResults;
})

const filteredCombinedQueries = computed(() => {
    const query = normalizeQuery(message.value.trim());

    if (! query) {
        return popularQueries.value
    }

    const fuse = new Fuse(results.value, {
        keys: ['normalized_query'],
        isCaseSensitive: false,
        ignoreDiacritics: true,
        shouldSort: false,     // sorting them manually

        includeMatches: true,  // include match details
        findAllMatches: false, // find all matches in the string
        minMatchCharLength: 3, // minimum length of the match

        threshold: 1,          // adjust for more/less fuzziness
        includeScore: true,
        ignoreLocation: false, // allows match anywhere in the string
    });

    const searchResults = fuse.search(query).map(result => {
        return {
            ...result.item,
            score: result.score,
            matches: result.matches,
        };
    }).sort((a, b) => {
        const typePriority = { suggestion: 0, popular: 1 };
        const aPriority = typePriority[a.type] ?? 3;
        const bPriority = typePriority[b.type] ?? 3;

        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        return (a.score ?? 1) - (b.score ?? 1); // lower score = better match
    });

    return searchResults;
});

function highlightMatchUsingNormalized(originalText, normalizedText, matches = []) {
    if (!matches.length || !originalText || !normalizedText) return originalText;

    const match = matches.find(m => m.key === 'normalized_query');
    if (!match || !match.indices?.length) return originalText;

    // Build a map from normalized string index → original string index
    const normToOrig = [];
    let j = 0;
    for (let i = 0; i < normalizedText.length && j < originalText.length; i++) {
        while (
            j < originalText.length &&
            normalizeChar(originalText[j]) !== normalizedText[i]
        ) {
            j++;
        }
        normToOrig[i] = j;
        j++;
    }

    let result = '';
    let lastIndex = 0;

    for (const [start, end] of match.indices) {
        const realStart = normToOrig[start] ?? -1;
        const realEnd = normToOrig[end] ?? -1;

        if (realStart === -1 || realEnd === -1) continue;

        result += originalText.slice(lastIndex, realStart);
        result += `<span class="bg-yellow-200">${originalText.slice(realStart, realEnd + 1)}</span>`;
        lastIndex = realEnd + 1;
    }

    result += originalText.slice(lastIndex);
    return result;
}

function normalizeChar(c) {
    return c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

const scrollToBottom = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollTo({
            top: scrollContainer.value.scrollHeight,
            behavior: "smooth",
        });
    }
};

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

const throttleSuggestions = throttle((val) => {
    searchQueryStore.fetchSuggestions(val);
}, 500);

watch(() => message.value, newValue => {
    activeIndex.value = -1;

    if (isSelectedManually.value) return;
    throttleSuggestions(newValue);
})

const handleSendMessage = (query) => {
    // to prevent sending messages when user clicks too many times in a row
    if (isQueryLoadingChat.value) return

    inputIsFocused.value = false;
    activeIndex.value = -1;

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

const handleClickOutsideSubscribeSelector = () => {
    showFrequencySelect.value = false
}

const handleShowFrequencySelector = () => {
    showFrequencySelect.value = true
    inputIsFocused.value = false
}

const handleDeletRecentQuries = async () => {
  const confirmed = window.confirm('Ești sigur că vrei să ștergi căutările recente?')

  if (!confirmed) return

  try {
    await searchQueryStore.deleteRecentQueries()
    notify({
      title: 'Căutările recente au fost șterse!',
    })
  } catch (err) {
    console.error('Delete recent queries error:', err)
  }
}

await searchQueryStore.fetchCombinedQueries()

if (process.client) {
    setTimeout(() => {
        if (!itemsStore.isChatInlineHasBeenMounted) {
            inputField.value.focus()

            localStorage.setItem('inputHasBeenMounted', 'true');
            itemsStore.isChatInlineHasBeenMounted = true
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