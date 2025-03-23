<template>
  <div :class="[{'h-full': defaultView!=chatStore.TYPE_LIST_HYBRID}, 'sm:max-w-xl w-full bg-white shadow-xs rounded-lg flex flex-col']">
    <!-- Header -->
    <slot name="header"></slot>

    <!-- Chat Window -->
    <div :class="{'flex-1 p-4 overflow-y-auto': defaultView!=chatStore.TYPE_LIST_HYBRID, 'hidden': defaultView==chatStore.TYPE_LIST_HYBRID}" ref="scrollContainer">
      <div class="space-y-4">
        <div v-for="(message, index) in messages" :key="index" class="flex">
          <div v-if="message.sender === 'user'" class="ml-auto relative">
            <p class="bg-blue-500 text-white py-2 px-4 rounded-lg shadow">
              <span>{{ message.text }}</span>
              <span v-if="isLoading && (index + 1 == messages.length)" class="absolute top-0 right-0 flex h-3 w-3"><span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span><span
                  class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span></span>
            </p>
          </div>

          <div v-else class="mr-auto">
            <div class="w-full" v-if="message.realEstate">
              <RealEstateSliderItems :items="message.realEstate" />
            </div>
            <div v-else>
              <p class="bg-gray-300 py-2 px-4 rounded-lg shadow" v-html="message.text" />
            </div>
          </div>
        </div>
      </div>

      <slot />
    </div>

    <!-- Input Field -->
    <div class="w-full rounded-b-lg flex justify-between relative" v-click-outside="handleClickOutside">
      <div class="relative flex-1">
        <input
          v-model="message"
          @input="searchPrompts"
          @focus="showRandomPrompts"
          @keyup.enter="() => handleSendMessage(message, false)"
          type="text"
          placeholder="Scrie ce cauți..."
          class="py-2 px-4 focus:ring-0 border-0 shadow-md w-full focus:outline-none"
          ref="inputField"
        />
        <div v-if="activeMessage?.length" @click="handleClearActiveMessage" class="absolute top-0 right-0 flex items-center w-[30px] h-full">
          <CircleX />
        </div>
      </div>
      <ul
        v-if="suggestions.length > 0 && defaultView==chatStore.TYPE_LIST_HYBRID"
        class="absolute no-scrollbar bottom-full left-0 w-full bg-white border max-h-48 overflow-y-auto z-10 mb-.5"
      >
        <li
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="px-4 py-2 text-medium text-gray-800 hover:bg-gray-200 cursor-pointer"
          @click="selectPrompt(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
      <button
        :disabled="isLoading"
        @click="() => handleSendMessage(message, false)"
        class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center"
      >
        <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <svg v-else class="animate-spin size-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { CircleX } from 'lucide-vue-next'

const message = ref('');
const suggestions = ref([]);

const props = defineProps({
  messages: {
    type: Object,
  },
  isLoading: {
    type: Boolean,
  },
  defaultView: {
    type: String,
  },
});

import { useFilterStore } from '@/stores/filters';
const filterStore = useFilterStore()

const { activeMessage } = storeToRefs(filterStore)

const prompts = [
  "Apartamente de vânzare în București sub 150.000 euro.",
  "Casă cu trei dormitoare și grădină în Cluj-Napoca.",
  "Opțiuni de închiriere în centrul Timișoarei.",
  "Apartament cu două camere în Constanța, aproape de plajă.",
  "Proprietăți cu minimum 100 mp în Iași.",
  "Case cu piscină și cel puțin patru dormitoare în Brașov.",
  "Apartamente cu terasă și vedere panoramică în Sibiu.",
  "Proprietăți cu panouri solare în Oradea.",
  "Casă cu birou pentru telemuncă în Craiova.",
  "Apartamente cu loc de parcare în centrul Aradului.",
  "Proprietăți aproape de Parcul Herăstrău în București.",
  "Apartament aproape de transport public în Cluj-Napoca.",
  "Case într-un cartier liniștit în Ploiești.",
  "Case aproape de școli bune în Galați.",
  "Proprietăți disponibile în Brașov.",
  "Proprietăți pentru investiții în Iași.",
  "Apartamente sub 80.000 euro în Constanța.",
  "Proprietăți de lux în centrul Clujului.",
  "Case în București cu preț redus.",
  "Apartamente eco-friendly în Sibiu.",
  "Cabană cu șemineu aproape de Brașov.",
  "Apartamente în stil industrial în Cluj-Napoca.",
  "Penthouse de lux în Timișoara cu vedere spre oraș.",
  "Case cu loc de joacă în Pitești.",
  "Casă cu patru dormitoare aproape de pădure în Brașov, sub 300.000 euro.",
  "Apartamente cu două băi, balcon și sală de sport în București.",
  "Casă cu minimum cinci camere și curte mare în Cluj-Napoca.",
  "Apartamente aproape de plajă cu parcare în Constanța.",
  "Case cu grădină în zone liniștite din București."
];

const scrollContainer = ref(null);
const emit = defineEmits(['submit', 'resetActiveMessage']);

const chatStore = useChatStore();

const handleClickOutside = () => {
  suggestions.value = []
}

const handleClearActiveMessage = () => {
  emit('resetActiveMessage')
  message.value = ''
}

const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: "smooth",
    });
  }
};

watch(props.messages, () => {
  scrollToBottom();
});

onMounted(() => {
  scrollToBottom();
});

const searchPrompts = () => {
  const query = message.value.toLowerCase();
  if (query.trim() === "") {
    suggestions.value = [];
    return;
  }
  suggestions.value = prompts
    .filter((prompt) => prompt.toLowerCase().includes(query))
    .slice(0, 5);
};

const showRandomPrompts = () => {
  suggestions.value = prompts.sort(() => 0.5 - Math.random()).slice(0, 5);
};

const selectPrompt = (prompt) => {
  message.value = prompt;
  suggestions.value = [];
};

const handleSendMessage = (query, resetMessage = true) => {
  emit("submit", query);
  if (resetMessage) {
    message.value = "";
  }
};
</script>
