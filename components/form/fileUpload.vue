<template>
    <div class="w-full mb-5">
      <label
        :for="id"
        class="flex flex-col items-center justify-center py-9 w-full border border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50"
      >
        <div class="mb-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <g id="Upload 02">
              <path
                id="icon"
                d="M16.296 25.3935L19.9997 21.6667L23.7034 25.3935M19.9997 35V21.759M10.7404 27.3611H9.855C6.253 27.3611 3.33301 24.4411 3.33301 20.8391C3.33301 17.2371 6.253 14.3171 9.855 14.3171V14.3171C10.344 14.3171 10.736 13.9195 10.7816 13.4326C11.2243 8.70174 15.1824 5 19.9997 5C25.1134 5 29.2589 9.1714 29.2589 14.3171H30.1444C33.7463 14.3171 36.6663 17.2371 36.6663 20.8391C36.6663 24.4411 33.7463 27.3611 30.1444 27.3611H29.2589"
                stroke="#4F46E5"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </g>
          </svg>
        </div>
        <h2 class="text-center text-gray-400 text-xs font-normal leading-4 mb-1">
          {{ acceptText }}
        </h2>
        <h4 class="text-center text-gray-900 text-sm font-medium leading-snug">
          Drag and Drop your file here or
        </h4>
        <input
          :id="id"
          type="file"
          class="hidden"
          :accept="accept"
          :multiple="multiple"
          @change="handleFileChange"
        />
      </label>
    </div>
  
    <!-- Preview Images -->
    <div v-if="previewImages.length" class="w-full grid gap-1 mb-4">
      <div
        v-for="(image, index) in previewImages" :key="image.id" class="flex items-center justify-between gap-2"
      >
        <div class="flex items-center gap-2">
          <img
            :src="image.src"
            alt="Preview"
            class="w-14 h-14 object-cover rounded-md"
          />
          <div class="grid gap-1">
            <h4 class="text-gray-900 text-sm font-normal">{{ image.name }}</h4>
            <h5 class="text-gray-400 text-xs font-normal">Upload complete</h5>
          </div>
        </div>
        <svg  @click="removeImage(image.id)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash size-4 cursor-pointer"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Props
  const props = defineProps({
    id: {
      type: String,
      default: 'dropzone-file',
    },
    accept: {
      type: String,
      default: 'image/png, image/jpeg, application/pdf',
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    maxFileSize: {
      type: Number,
      default: 15 * 1024 * 1024, // 15MB
    },
    acceptText: {
      type: String,
      default: 'PNG, JPG or PDF, smaller than 15MB',
    },
  })
  
  // Generate a unique ID
  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Emits
  const emit = defineEmits(['files-selected'])
  
  // Reactive state for previews
  const previewImages = ref([])
  
  // Handle file input change
  const handleFileChange = (event) => {
    const files = event.target.files
    const validFiles = []
  
    for (const file of files) {
      if (file.size > props.maxFileSize) {
        alert(`${file.name} exceeds the maximum file size of ${maxFileSize / 1024 / 1024} MB.`)
        continue
      }
  
      const uniqueId = generateUniqueId() // Generate a unique ID

      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          previewImages.value.push({
            id: uniqueId,
            name: file.name,
            src: e.target.result
          })
        }
        reader.readAsDataURL(file)
      }
      validFiles.push(file)
    }
  
    // Emit the selected files to the parent
    emit('files-selected', validFiles)
  }
  
  // Remove image from preview
  const removeImage = (index) => {
    previewImages.value.splice(index, 1)
  }
  </script>