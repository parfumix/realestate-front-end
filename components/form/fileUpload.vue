<template>
  <div :id="id" class="w-full mb-5 scroll-my-12">
    <label :for="`input-${id}`"
      class="flex flex-col items-center justify-center py-9 w-full border border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50">
      <div class="mb-3 flex items-center justify-center">
        <CloudUpload size="40" />
      </div>
      <h2 class="text-center text-gray-400 text-xs font-normal leading-4 mb-1">
        {{ acceptText }}
      </h2>
      <h4 class="text-center text-gray-900 text-sm font-medium leading-snug">
        Trageți și plasați fișierul aici
      </h4>
      <input :id="`input-${id}`" type="file" class="hidden" :accept="accept" :multiple="multiple"
        @change="handleFileChange" />
    </label>
  </div>

  <!-- Preview Images -->
  <div v-if="previewImages.length" class="w-full grid gap-1 mb-4">
    <VueGallery :options="galleryOptions" :images="galleryImages" :index="galleryIndex" @close="closeGallery" />

    <div v-for="(image, index) in previewImages" :key="image.id" class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <img :src="image.src" alt="Preview" class="w-14 h-14 object-cover rounded-md" @click="openGallery(index)" />
        <div class="grid gap-1">
          <h4 class="text-gray-900 text-sm font-normal">{{ image?.name }}</h4>
          <h5 class="text-gray-400 text-xs font-normal">Încărcare completă</h5>
        </div>
      </div>
      <CircleMinus class="cursor-pointer text-red-500 hover:text-red-600" size="16" @click="removeImage(image.id)" />
    </div>

    <p v-if="error" :id="`${id}-error`" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import VueGallery from 'vue-gallery';
import { CloudUpload, CircleMinus } from 'lucide-vue-next';

// Props
const props = defineProps({
  id: {
    type: String,
    default: 'dropzone-file',
  },
  required: {
    type: Boolean,
    default: false,
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
    default: 'PNG, JPG sau PDF, mai mic de 15 MB',
  },
  error: {
    type: String,
    default: ''
  }
})

// Generate a unique ID
const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Reactive state for previews
const previewImages = ref([])
const galleryImages = ref([]);
const galleryIndex = ref(null);

const images = defineModel({ type: Array, default: [] })

// Handle file input change
const handleFileChange = (event) => {
  const files = event.target.files

  for (const file of files) {
    if (file.size > props.maxFileSize) {
      alert(`${file.name} depășește dimensiunea maximă a fișierului de ${maxFileSize / 1024 / 1024} MB.`);
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
        galleryImages.value.push(e.target.result);

      }
      reader.readAsDataURL(file)
    }

    images.value = [...images.value, ...[
      { ...{ file }, ...{ id: uniqueId } }
    ]]
  }
}

const openGallery = (index) => {
  galleryIndex.value = index;
};

const closeGallery = () => {
  galleryIndex.value = null;
};

// Options for the gallery to adjust image size
const galleryOptions = {
  onslide: function (index, slide) {
    // Get the image element
    const img = slide.getElementsByTagName('img')[0];
    if (img) {
      // Apply a smaller size or custom scaling
      img.style.maxWidth = '80%';
      img.style.maxHeight = '80%';
    }
  },
};

// Remove image from preview
const removeImage = (id) => {
  const previewIndex = previewImages.value.findIndex(image => image.id === id);
  if (previewIndex !== -1) {
    previewImages.value.splice(previewIndex, 1);
    galleryImages.value.splice(previewIndex, 1);
  }

  const imagesIndex = images.value.findIndex(image => image.id === id);
  if (imagesIndex !== -1) {
    images.value.splice(imagesIndex, 1);
  }
}
</script>
