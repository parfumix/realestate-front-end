<template>
    <TransitionRoot as="template" :show="isModalOpen">
      <Dialog class="relative z-10" @close="isModalOpen = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl flex">
                <div class="w-2/6 pb-4 sm:pb-4 bg-white">
                  <ModalsRealEstateChat />
                </div>
                <div class="w-4/6 bg-transparent pb-4 sm:pb-4">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left">
                    <ModalsRealEstateTabs :tabs="tabs" @select="(tab) => activeTab=tab.slug" />
                    
                    <transition name="fade">
                      <div v-if="activeTab === 'general'" key="general">
                        <DialogTitle as="h3" class="text-lg py-2 bg-white text-black font-semibold leading-6">{{ item?.title }}</DialogTitle>
                        <ModalsRealEstateGallerySlider :items="item?.images" />
                        <ModalsRealEstateStats :item="item" />
                        <div class="overflow-auto h-[300px]">
                          <ModalsRealEstateDescription :item="item" />
                        </div>
                      </div>
                    </transition>

                    <transition name="fade">
                      <div v-if="activeTab === 'map'" key="map">
                        <div class="h-[300px]">
                          <ModalsRealEstateMap class="h-[300px]" :item="item" />
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

// Define the open state
const props = defineProps({
  item: {
    type: [Object, Boolean]
  }
})

const tabs = ref([
  { name: 'General', href: '#', slug: 'general' },
  { name: 'Harta', href: '#', slug: 'map' },
])

const activeTab = ref('general')

const isModalOpen = ref(props.item ? true : false);  // Or data() for Options API

// Define emits
const emit = defineEmits(['close'])

watch(() => props.item, (item) => {
  isModalOpen.value = item ? true : false
})

// Watch for changes in 'open' and emit 'close' event if it's false
watch(() => isModalOpen.value, (newMode) => {
  if (! newMode) {
    emit('close')
  }
})
</script>
