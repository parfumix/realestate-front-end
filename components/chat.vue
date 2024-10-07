<template>
  <!-- Header -->
  <div class="bg-blue-500 text-white py-2 px-4 rounded-t-lg">
    <h1 class="text-md">Real Estate Chat</h1>
  </div>

  <!-- Chat Window -->
  <div class="flex-1 p-4 overflow-y-auto">
    <div class="space-y-4">
      <div v-for="(message, index) in messages" :key="index" class="flex">
        <div v-if="message.sender === 'user'" class="ml-auto">
          <p class="bg-blue-500 text-white py-2 px-4 rounded-lg shadow" v-html="message.text" />
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
  <div class="w-full rounded-b-lg flex justify-between border-t border-gray-300 ">
    <input v-model="message" @keyup.enter="() => handleSendMessage(message)" type="text" placeholder="Scrie ce cauți..." class="flex-1 py-2 px-4 focus:ring-0 focus:outline-none" />
    <button @click="() => handleSendMessage(message)" class="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Send</button>
  </div>
</template>

<script setup>
const message = ref('')

const props = defineProps({
    messages: {
        type: Object
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

