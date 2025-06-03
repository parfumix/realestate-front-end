<template>
  <div class="flex w-full">
    <div class="w-2/6 bg-white">
        <ModalsRealEstateChat :item="item" @map="handleMap" />
    </div>
    <div class="w-3/6 bg-transparent">
        <div class="mt-3 text-center sm:mt-0 sm:text-left">
        <div class="h-full" key="general">
            <h3
                ass="text-2xl pt-4 px-1 bg-white text-black font-semibold leading-6"
                v-html="propertyTitle"
            />
            <ModalsRealEstateActions :item="item" />

            <div class="overflow-y-auto max-h-[calc(100vh-200px)] pb-[20px]">
            <ModalsRealEstateGallerySlider :items="item?.images.filter((el) => el !== null)" />
            <ModalsRealEstateStats :item="item" />
            <ModalsRealEstateDescription :item="item" />

            <ClientOnly>
                <ModalsRealEstateMap
                    v-if="item.meta?.lng && item.meta?.lat"
                    :item="item"
                    :trigger="triggerMap"
                    :amenity="activeAmenity"
                    :nearbyPlaces="nearbyPlaces"
                />
            </ClientOnly>
            </div>
        </div>
        </div>
    </div>
    <div class="w-1/6 bg-white">
        <ModalsRealEstateRightSidebar :item="item" />
    </div>
  </div>
</template>

<script setup>
import { setHead } from '../../utils'

const route = useRoute()
const slug = route.params.slug

import { useItemsStore } from '@/stores/itemsStore';
const itemsStore = useItemsStore()
let item = ref(null)

try {
    item.value = await itemsStore.findItemBySlug(slug)
    if(! item.value) throw new Error('Item not found')

    setHead(item.value.title)
} catch (error) {
  console.error('Error fetching item:', error)
  // Handle the error, e.g., redirect or show an error message
}

const activeAmenity = ref(null)
const nearbyPlaces = ref([])
const triggerMap = ref(0)

// Set the active amenity to the first one if available
const handleMap = ({ amenities, nearby_places }) => {
  activeAmenity.value = amenities.length ? amenities[0] : null
  nearbyPlaces.value = nearby_places || []
  triggerMap.value += 1 // Trigger re-render
}

const propertyTitle = computed(() => {
  const { room_count, area, price, location } = item.value
  return `${room_count} camere, ${area} mp - ${price} EUR - ${location}`
})
</script>
