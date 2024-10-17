<template>
    <TransitionRoot as="template" :show="isModalOpen">
      <Dialog class="relative z-10" @close="isModalOpen = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex  items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl flex h-[calc(100dvh-100px)]">
                <div class="w-2/6 pb-4 sm:pb-4 bg-white">
                  <ModalsRealEstateChat />
                </div>
                <div class="w-4/6 bg-transparent pb-4 sm:pb-4">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left">
                    <ModalsRealEstateTabs :tabs="tabs" :activeTab="activeTab" @select="(tab) => activeTab=tab.slug" />
                    
                    <transition name="fade">
                      <div class="h-full" v-if="activeTab === 'general'" key="general">
                        <DialogTitle as="h3" class="text-2xl pt-4 px-1 bg-white text-black font-semibold leading-6" v-html="propertyTitle" />
                        <ModalsRealEstateActions :item="item" />

                        <div class="overflow-y-auto h-full">
                          <ModalsRealEstateGallerySlider :items="item?.images" />
                          <ModalsRealEstateStats :item="item" />
                          <ModalsRealEstateDescription :item="item" />
                        </div>
                      </div>
                    </transition>

                    <transition name="fade">
                      <div v-if="activeTab === 'map'" key="map">
                        <ModalsRealEstateMap :item="item" />
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
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

// Define the open state
const props = defineProps({
  item: {
    type: [Object, Boolean]
  }
})

const tabs = ref([
  { name: 'General', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" /></svg>', slug: 'general' },
  { name: 'Hartă', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>', slug: 'map' },
])

const activeTab = ref('general')

const isModalOpen = ref(props.item ? true : false);  // Or data() for Options API

// Define emits
const emit = defineEmits(['close'])

const propertyTitle = computed(() => {
    const { room_count, area, price, street } = props.item;
    return `${room_count} camere, ${area} mp - ${price} EUR - ${street}`;
});

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
