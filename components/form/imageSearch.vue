<template>
    <div class="absolute inset-0 z-50 flex items-center justify-center">
      <div class="bg-[#202124] text-white w-full max-w-md rounded-xl p-6 relative">
        <h2 class="text-lg font-semibold text-center mb-4">Search any image</h2>
  
        <!-- Drop zone -->
        <div
          class="border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-[#303134]"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="$refs.fileInput.click()"
        >
          <!-- <img src="/placeholder-image-icon.svg" alt="" class="w-12 h-12 mb-2" /> -->
          <p>Drag an image here or <span class="underline text-blue-400">upload a file</span></p>
          <input ref="fileInput" type="file" class="hidden" @change="handleFileUpload" accept="image/*" />
        </div>
  
        <!-- OR separator -->
        <div class="flex items-center my-4">
          <div class="flex-1 h-px bg-gray-600"></div>
          <div class="px-2 text-sm text-gray-400">OR</div>
          <div class="flex-1 h-px bg-gray-600"></div>
        </div>
  
        <!-- Paste URL -->
        <div class="flex gap-2">
          <input
            v-model="imageUrl"
            type="text"
            placeholder="Paste image link"
            class="flex-1 px-4 py-2 rounded bg-[#303134] text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            @click="handleSearchUrl"
            class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Search
          </button>
        </div>
  
        <!-- Close Button -->
        <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { X } from 'lucide-vue-next'
  
  const emit = defineEmits(['close', 'search'])
  const imageUrl = ref('')
  const fileInput = ref(null)
  
  const handleDrop = (e) => {
    const file = e.dataTransfer.files[0]
    if (file) emit('search', { file })
  }
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) emit('search', { file })
  }
  
  const handleSearchUrl = () => {
    if (imageUrl.value) emit('search', { url: imageUrl.value })
  }
  </script>
  