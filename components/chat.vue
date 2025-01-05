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
    <div class="w-full rounded-b-lg flex justify-between">
      <input v-model="message" @keyup.enter="() => handleSendMessage(message)" type="text"
        placeholder="Scrie ce cauți..."
        class="flex-1 py-2 px-4 focus:ring-0 border-0 shadow-md w-full focus:outline-none" />
      <button :disabled="isLoading" @click="() => handleSendMessage(message)"
        class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center">
        <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="size-6">
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
const message = ref('')

const props = defineProps({
  messages: {
    type: Object
  },
  isLoading: {
    type: Boolean
  },
  defaultView: {
    type: String
  },
})

// https://chatgpt.com/g/g-p-6760b02a9c488191abc8e3b939171d32-imai-ro/c/677ac586-d914-8006-8ef0-935d08267bbe
const prompts = [
  {
    "category": "General Search",
    "prompts": [
      "Arată-mi apartamente de vânzare în București sub 150.000 euro.",
      "Caut o casă cu trei dormitoare în Cluj-Napoca, cu grădină.",
      "Ce opțiuni de închiriere sunt disponibile în centrul Timișoarei sub 400 euro/lună?",
      "Vreau un apartament cu două camere în Constanța, aproape de plajă.",
      "Găsește proprietăți cu minimum 100 mp în Iași."
    ]
  },
  {
    "category": "Feature-Specific Search",
    "prompts": [
      "Caut case cu piscină și cel puțin patru dormitoare în Brașov.",
      "Arată-mi apartamente cu terasă și vedere panoramică în Sibiu.",
      "Există proprietăți cu panouri solare și eficiență energetică în Oradea?",
      "Caut o casă cu birou pentru telemuncă în Craiova.",
      "Găsește apartamente cu loc de parcare în centrul Aradului."
    ]
  },
  {
    "category": "Location-Based Search",
    "prompts": [
      "Ce proprietăți sunt disponibile aproape de Parcul Herăstrău în București?",
      "Vreau un apartament închiriabil aproape de transportul public din Cluj-Napoca.",
      "Există case într-un cartier liniștit în Ploiești?",
      "Găsește apartamente prietenoase cu animalele de companie în Târgu Mureș.",
      "Ce case sunt disponibile aproape de școli bune în Galați?"
    ]
  },
  {
    "category": "Budget and Investment Focused",
    "prompts": [
      "Am un buget de 200.000 euro. Ce proprietăți sunt disponibile în Brașov?",
      "Găsește proprietăți cu potențial bun de investiție în Iași.",
      "Există apartamente sub 80.000 euro în Constanța?",
      "Arată-mi proprietăți de lux în centrul Clujului.",
      "Ce case sunt disponibile în București, cu preț redus recent?"
    ]
  },
  {
    "category": "Lifestyle Searches",
    "prompts": [
      "Găsește apartamente eco-friendly cu multă lumină naturală în Sibiu.",
      "Vreau o cabană la munte cu șemineu în apropiere de Brașov.",
      "Există apartamente în stil industrial în Cluj-Napoca?",
      "Caut un penthouse de lux în Timișoara cu vedere spre oraș.",
      "Arată-mi case prietenoase pentru familii, cu loc de joacă, în Pitești."
    ]
  },
  {
    "category": "Combination Searches",
    "prompts": [
      "Găsește o casă cu patru dormitoare în Brașov, aproape de pădure, sub 300.000 euro.",
      "Arată-mi apartamente cu două băi, balcon și acces la sală de sport în București.",
      "Vreau o casă cu minimum cinci camere, curte mare, într-un cartier rezidențial din Cluj-Napoca.",
      "Ce apartamente sunt disponibile în Constanța, aproape de plajă, cu loc de parcare, sub 500 euro/lună?",
      "Caut case în București, într-o zonă liniștită, cu grădină și preț între 150.000 și 250.000 euro."
    ]
  }
]

const scrollContainer = ref(null);

const emit = defineEmits(['submit'])

const chatStore = useChatStore()

// Function to smoothly scroll to the bottom
const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth', // Enable smooth scrolling
    });
  }
};

// Watch for changes in items and scroll down when new items are added
watch(props.messages, () => {
  scrollToBottom();
});

// Scroll to bottom on initial mount
onMounted(() => {
  scrollToBottom();
});

const handleSendMessage = (query, resetMessage = true) => {
  emit('submit', query)
  if (resetMessage) {
    message.value = ''
  }
}
</script>
