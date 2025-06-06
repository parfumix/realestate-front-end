<template>
  <div class="h-[calc(100dvh-150px)]">
    <div id="map-item" style="height: 50%; width: 100%" />

    <nav style="height: 10%" class="flex justify-between items-center border-0 rounded-full px-2">
      <!-- Left navigation button -->
      <div class="w-3 z-[60] mr-2">
        <svg
          @click="templateSlidePrev"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="text-gray-500 cursor-pointer size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>

      <!-- Slider with items -->
      <slider
        :slidesPerView="'auto'"
        ref="templateRef"
        class="mx-6 swiper-slide-templates"
        :slideClass="'swiper-slide-templates-slide'"
        :items="typeOfAmenities"
        v-slot="{ item: tab }"
      >
        <a
          :key="tab.type"
          :class="[
            selectedAmenityType == tab.type
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
            'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm items-center font-medium cursor-pointer',
          ]"
          :aria-current="selectedAmenityType == tab.type ? 'page' : undefined"
          @click.prevent="changeAmenityType(tab.type)"
        >
          <utils-svg-render :svgUrl="tab?.iconUrl" class="mr-2" />
          {{ tab?.name }}
        </a>
      </slider>

      <!-- Right navigation button -->
      <div class="w-3 z-[60] mx-2">
        <svg
          @click="templateSlideNext"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="text-gray-500 cursor-pointer size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
    </nav>

    <modals-real-estate-amenities style="height: 40%" :items="currentPlaces" />
  </div>
</template>

<script setup>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import debounce from 'lodash-es/debounce'

import { getRomanianBounds, calculateTravelTime } from '../utils'

import { getNearbyPlaces } from '../../api/items'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  triggerMap: {
    type: Number,
  },
  amenity: {
    type: String,
  },
  nearbyPlaces: {
    type: Array,
    default: () => [],
  },
})

const templateRef = ref(null)

const templateSlideNext = () => {
  return templateRef.value.slideNext()
}

const templateSlidePrev = () => {
  return templateRef.value.slidePrev()
}

let map
let markersCluster
let currentPlaces = ref([])

// Category mapping object
const amenities = [
  // Education
  'school',
  'kindergarten',
  'library',

  // Sustenance
  'cafe',
  'restaurant',
  'supermarket',

  // Healthcare
  'hospital',
  'pharmacy',

  // Transportation
  'bus_station',
  'parking',

  // Recreation
  'park',
  'gym',
]

const amenityDetails = {
  school: { name: 'Școli', iconUrl: '/icons/school-icon.svg' },
  kindergarten: { name: 'Grădinițe', iconUrl: '/icons/kindergarten-icon.svg' },
  library: { name: 'Biblioteci', iconUrl: '/icons/library-icon.svg' },
  cafe: { name: 'Cafenele', iconUrl: '/icons/cafe-icon.svg' },
  restaurant: { name: 'Restaurante', iconUrl: '/icons/restaurant-icon.svg' },
  supermarket: { name: 'Supermarketuri', iconUrl: '/icons/supermarket-icon.svg' },
  hospital: { name: 'Spitale', iconUrl: '/icons/hospital-icon.svg' },
  pharmacy: { name: 'Farmacii', iconUrl: '/icons/pharmacy-icon.svg' },
  bus_station: { name: 'Stații de autobuz', iconUrl: '/icons/bus-station-icon.svg' },
  parking: { name: 'Parcări', iconUrl: '/icons/parking-icon.svg' },
  park: { name: 'Parcuri', iconUrl: '/icons/park-icon.svg' },
  gym: { name: 'Săli de sport', iconUrl: '/icons/gym-icon.svg' },
}

const typeOfAmenities = amenities.map((type) => {
  const details = amenityDetails[type]
  return {
    type,
    name: details.name,
    iconUrl: details.iconUrl,
    icon: L.icon({
      iconUrl: details.iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    }),
  }
})

const amenityCache = ref({})
const amenitiesMarkers = ref([])
const selectedAmenityType = ref(null)

const isLoading = ref(false)

const initializeMap = async () => {
  const romaniaBounds = getRomanianBounds()

  const mapCenter = ref([props.item.meta?.lat || 47.21322, props.item.meta?.lng || -1.559482])
  const mapZoom = ref(13)

  map = L.map('map-item', {
    maxZoom: 18,
    minZoom: 8,
  }).setView(mapCenter.value, mapZoom.value)

  // Create a new marker cluster group
  markersCluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 20,
    iconCreateFunction: (cluster) => {
      return createClusterIcon(cluster.getChildCount())
    },
  })
  map.addLayer(markersCluster)

  // Set max bounds to keep the map restricted within Romania
  map.setMaxBounds(romaniaBounds)

  // Optionally, you can set options to disable dragging outside bounds
  map.options.maxBoundsViscosity = 1

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    opacity: 1,
  }).addTo(map)

  let circle = L.circle([props.item.meta.lat, props.item.meta.lng], {
    radius: 500,
    color: 'blue',
    fillOpacity: 0.1,
  }).addTo(map)
}

const buildAmenityCacheKey = (lat, lng, type) => {
  return `${lat},${lng},${type}`
}

const loadAmenities = async () => {
  isLoading.value = true

  try {
    const { lat, lng } = props.item.meta
    const cacheKey = buildAmenityCacheKey(lat, lng, selectedAmenityType.value)

    // Check if the data is already in the cache
    if (amenityCache.value[cacheKey]) {
      currentPlaces.value = amenityCache.value[cacheKey]
      updateAmenitiesMarkers(amenityCache.value[cacheKey])
      return
    }

    const { data: places } = await getNearbyPlaces(props.item.id, {
      amenities: [selectedAmenityType.value],
      distance: 5000, // 5 km radius
      limit: 20, // Limit to 100 results
    })

    if (!places || places.length === 0) {
      console.warn('No amenities found for the selected type:', selectedAmenityType.value)
      return
    }

    // Cache the data
    amenityCache.value[cacheKey] = places
    currentPlaces.value = places

    // Update markers on the map
    updateAmenitiesMarkers(places)
  } catch (error) {
    console.error('Failed to load amenities:', error)
  } finally {
    isLoading.value = false
  }
}

const scaleIcon = (dist_meters) => {
  // Define scaling logic
  return Math.max(20, 40 - dist_meters / 100) // Icon size decreases as distance increases
}

const updateAmenitiesMarkers = (places) => {
  markersCluster.clearLayers()

  // Clear existing markers and clusters
  amenitiesMarkers.value.forEach((marker) => marker.remove())
  amenitiesMarkers.value = []

  // Define a default icon as a fallback
  const defaultIcon = L.icon({
    iconUrl: '/icons/default-icon.svg', // Path to your default SVG icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  // Create a bounds object to track marker positions
  const bounds = L.latLngBounds()

  // Add markers to the cluster group
  // Add markers with detailed data and popups
  places.forEach(({ name, dist_meters, lat, long, type }) => {
    const amenity = typeOfAmenities.find((amenity) => amenity.type === type)
    const iconSize = scaleIcon(dist_meters) // Dynamically calculate icon size
    const travelTimeWalking = calculateTravelTime(dist_meters, 'walking')
    const travelTimeDriving = calculateTravelTime(dist_meters, 'driving')

    const icon = amenity
      ? L.icon({
          iconUrl: amenity.iconUrl,
          iconSize: [iconSize, iconSize],
          iconAnchor: [iconSize / 2, iconSize],
          popupAnchor: [0, -iconSize / 2],
        })
      : defaultIcon

    const marker = L.marker([lat, long], { icon, data: { name, dist_meters, type } }).bindPopup(`
            <div class='bg-white text-gray-800 font-bold shadow-md' aria-label="Information about ${name}">
              <strong>${name}</strong><br>
              <span>Distance: ${(dist_meters / 1000).toFixed(2)} km distanţă</span>
              <span>Walking: ${travelTimeWalking} minutes</span>
              <span>Driving: ${travelTimeDriving} minutes</span>
            </div>`)

    markersCluster.addLayer(marker)
    amenitiesMarkers.value.push(marker)

    // Extend the bounds to include this marker
    bounds.extend([lat, long])
  })

  // Adjust the map to fit the bounds of the new markers
  if (places.length > 0) {
    map.fitBounds(bounds, { padding: [20, 20] })
  }
}

const debouncedLoadAmenities = debounce(loadAmenities, 300)

const changeAmenityType = (type) => {
  selectedAmenityType.value = type
  debouncedLoadAmenities()
}

onUnmounted(() => {
  if (map) {
    map.off()
    map.remove()
  }
})

// Helper function to create a dynamic icon based on the cluster count
function createClusterIcon(count) {
  const baseSize = 20 // Base icon size for small clusters
  const maxSize = 40 // Maximum icon size for large clusters
  const scalingFactor = 5 // Controls how quickly the icon grows

  // Calculate icon size using a capped scaling based on the square root of the count
  const iconSize = Math.min(baseSize + Math.sqrt(count) * scalingFactor, maxSize)

  return L.divIcon({
    className: '', // No additional class is needed here since TailwindCSS will handle styling through inline HTML
    html: `<div class="flex items-center justify-center rounded-full bg-white text-gray-800 font-bold shadow-md" 
                style="width: ${iconSize}px; height: ${iconSize}px;">
               ${count}
             </div>`,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
  })
}

watch(
  () => props.amenity,
  (newAmenity) => {
    nextTick(async () => {
      changeAmenityType(newAmenity)
    })
  },
)

watch(
  () => props.triggerMap,
  () => {
    if (!map) {
      nextTick(async () => {
        selectedAmenityType.value = props.amenity ?? typeOfAmenities[0].type
        
        // Initialize the cache with the current nearby places
        const { lat, lng } = props.item.meta
        const cacheKey = buildAmenityCacheKey(lat, lng, selectedAmenityType.value)
        amenityCache.value[cacheKey] = props.nearbyPlaces || []

        await initializeMap()
        await loadAmenities()
      })
    }
  },
  { immediate: true },
)
</script>

<style>
.swiper-slide-templates .swiper-slide-templates-slide {
  width: auto !important;
  display: inline-block;
}
</style>
