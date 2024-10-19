<template>
  <div class="h-full sm:max-w-xl w-full bg-white shadow-xs rounded-lg flex flex-col">
    <!-- Header -->
    <slot name="header"></slot>

    <!-- Chat Window -->
    <div class="flex-1 p-4 overflow-y-auto">
      <div class="space-y-4">
        <div v-for="(message, index) in messages" :key="index" class="flex">
          <div v-if="message.sender === 'user'" class="ml-auto relative">
            <p class="bg-blue-500 text-white py-2 px-4 rounded-lg shadow">
              <span>{{ message.text }}</span>
              <span v-if="isLoading && (index+1 == messages.length)" class="absolute top-0 right-0 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span></span>
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
      <input v-model="message" @keyup.enter="() => handleSendMessage(message)" type="text" placeholder="Scrie ce cauți..." class="flex-1 py-2 px-4 focus:ring-0 border-0 shadow-md w-full focus:outline-none" />
      <button :disabled="isLoading" @click="() => handleSendMessage(message)" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center">
        <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        <svg v-else class="animate-spin size-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
})

const emit = defineEmits(['submit'])

const handleSendMessage = (query, resetMessage = true) => {
    emit('submit', query)
    if(resetMessage) {
      message.value = ''
    }
}
</script>

