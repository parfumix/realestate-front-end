<template>
  <div class="w-2/6 bg-white">
    <ModalsRealEstateChat :item="item" @map="handleMap" />
  </div>
  <div class="w-3/6 bg-transparent">
    <div class="mt-3 text-center sm:mt-0 sm:text-left">
      <div class="h-full" key="general">
        <h3
          class="text-2xl pt-4 px-1 bg-white text-black font-semibold leading-6"
          v-html="propertyTitle"
        />
        <ModalsRealEstateActions />

        <div class="overflow-y-auto max-h-[calc(100vh-200px)] pb-[20px]">
          <ModalsRealEstateGallerySlider :items="item?.images.filter((el) => el !== null)" />
          <ModalsRealEstateStats :item="item" />
          <ModalsRealEstateDescription :item="item" />
        </div>
      </div>

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
  <div class="w-1/6 bg-white">
    <ModalsRealEstateRightSidebar :item="item" />
  </div>
</template>

<script setup>
const itemsStore = useItemsStore()

const { selectedItem: item } = storeToRefs(itemsStore)

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
