<template>
  <div class="w-2/6 pb-4 sm:pb-4 bg-white">
    <ModalsRealEstateChat :item="item" @select="handleSelectTab" />
  </div>
  <div class="w-4/6 bg-transparent pb-4 sm:pb-4">
    <div class="mt-3 text-center sm:mt-0 sm:text-left">
      <ModalsRealEstateTabs :tabs="tabs" :activeTab="activeTab" @select="(tab) => activeTab = tab.slug" />

      <transition name="fade">
        <div class="h-full" v-if="activeTab === 'general'" key="general">
          <h3 class="text-2xl pt-4 px-1 bg-white text-black font-semibold leading-6" v-html="propertyTitle" />
          <ModalsRealEstateActions />

          <div class="overflow-y-auto max-h-[calc(100vh-200px)] pb-[20px]">
            <ModalsRealEstateGallerySlider :items="item?.meta?.images" />
            <ModalsRealEstateStats :item="item" />
            <ModalsRealEstateDescription :item="item" />
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-show="activeTab == 'map'" key="map">
          <ModalsRealEstateMap v-if="item.meta?.lng && item.meta?.lat" :activeTab="activeTab" :item="item" :amenity="activeAmenity" />  
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
const chatStore = useChatStore()

const { selectedItem: item } = storeToRefs(chatStore)

const tabs = ref([
  { name: 'General', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" /></svg>', slug: 'general' },
  { name: 'Hartă', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>', slug: 'map' },
])

const activeTab = ref('general')
const activeAmenity = ref(null)

const handleSelectTab = (tab, amenity = null) => {
      activeTab.value = tab
      activeAmenity.value = amenity
  }

const propertyTitle = computed(() => {
  const { room_count, area, price, street } = item.value;
  return `${room_count} camere, ${area} mp - ${price} EUR - ${street}`;
});
</script>
