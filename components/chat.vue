<template>
  <!-- Header -->
  <div class="bg-blue-500 text-white py-3 px-4 rounded-t-lg">
    <h1 class="text-lg">Real Estate Chat</h1>
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
            <slider :slidesPerView="2" ref="sliderRef" class="mx-4 w-[480px]" :items="message.realEstate" v-slot="{ item }">
              <Item :item="item" @click="handleShowModal(item)" class="h-[150px] divide-y divide-gray-200 rounded-lg bg-white shadow" />
            </slider>
          </div>
          <!-- Else, display bot text messages -->
          <div v-else>
            <p class="bg-gray-300 py-2 px-4 rounded-lg shadow" v-html="message.text" />
          </div>
        </div>
      </div>
    </div>

    <slot />
  </div>

  <!-- Input Field -->
  <div class="bg-gray-200 p-4 rounded-b-lg flex">
    <input v-model="message" @keyup.enter="() => handleSendMessage(message)" type="text" placeholder="Type a message..." class="flex-1 py-2 px-4 rounded-lg border border-gray-300 focus:outline-none" />
    <button @click="() => handleSendMessage(message)" class="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Send</button>
  </div>

  <ModalsRealEstateProperty :item="currentModalItem" @close="handleCloseModal" class="z-[100]" />
</template>

<script setup>
const message = ref('')

const props = defineProps({
    messages: {
        type: Object
    },
})

const emit = defineEmits(['submit'])

const currentModalItem = ref(null)
const handleShowModal = (item) => {
  currentModalItem.value = item
}

const handleCloseModal = () => {
  setTimeout(() => {
    currentModalItem.value = false
  }, 340)
}

const handleSendMessage = (query, resetMessage = true) => {
    emit('submit', query)
    if(resetMessage) {
      message.value = ''
    }
}
</script>