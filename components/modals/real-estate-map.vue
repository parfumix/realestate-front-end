<template>
  <div>
    <div id="map-item" style="height: 350px; width: 100%;" />

    <nav class="flex justify-between items-center border-0 rounded-full px-2">
      <!-- Left navigation button -->
      <div class="w-3 z-[60] mr-2">
        <svg @click="templateSlidePrev" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke-width="1.5" stroke="currentColor" class="text-gray-500 cursor-pointer size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>

      <!-- Slider with items -->
      <slider :slidesPerView="'auto'" ref="templateRef" class="mx-6 swiper-slide-templates"
        :slideClass="'swiper-slide-templates-slide'" :items="typeOfAmenities" v-slot="{ item: tab }">
        <a :key="tab.type"
          :class="[selectedAmenityType == tab.type ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700', 'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm items-center font-medium cursor-pointer']"
          :aria-current="selectedAmenityType == tab.type ? 'page' : undefined"
          @click.prevent="changeAmenityType(tab.type)">
          <utils-svg-render :svgUrl="tab?.iconUrl" class="mr-2" />
          {{ tab?.name }}
        </a>
      </slider>

      <!-- Right navigation button -->
      <div class="w-3 z-[60] mx-2">
        <svg @click="templateSlideNext" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke-width="1.5" stroke="currentColor" class="text-gray-500 cursor-pointer size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
    </nav>

    <modals-real-estate-amenities :items="currentPlaces" class="mx-6 py-3 h-[300px] overflow-y-auto" />
  </div>
</template>

<script setup>
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { getRomanianBounds } from '../utils'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  activeTab: {
    type: String,
  }
});

const templateRef = ref(null);

const templateSlideNext = () => {
  return templateRef.value.slideNext();
};
const templateSlidePrev = () => {
  return templateRef.value.slidePrev();
};

let map;
let markersCluster;
let currentPlaces = ref([]);

// Category mapping object
const amenities = [
  // Education
  "school",
  "kindergarten",
  "library",

  // Sustenance
  "cafe",
  "restaurant",
  "supermarket",

  // Healthcare
  "hospital",
  "pharmacy",

  // Transportation
  "bus_station",
  "parking",

  // Recreation
  "park",
  "gym"
];

const amenityDetails = {
  school: { name: "Școli", iconUrl: '/icons/school-icon.svg' },
  kindergarten: { name: "Grădinițe", iconUrl: '/icons/kindergarten-icon.svg' },
  library: { name: "Biblioteci", iconUrl: '/icons/library-icon.svg' },
  cafe: { name: "Cafenele", iconUrl: '/icons/cafe-icon.svg' },
  restaurant: { name: "Restaurante", iconUrl: '/icons/restaurant-icon.svg' },
  supermarket: { name: "Supermarketuri", iconUrl: '/icons/supermarket-icon.svg' },
  hospital: { name: "Spitale", iconUrl: '/icons/hospital-icon.svg' },
  pharmacy: { name: "Farmacii", iconUrl: '/icons/pharmacy-icon.svg' },
  bus_station: { name: "Stații de autobuz", iconUrl: '/icons/bus-station-icon.svg' },
  parking: { name: "Parcări", iconUrl: '/icons/parking-icon.svg' },
  park: { name: "Parcuri", iconUrl: '/icons/park-icon.svg' },
  gym: { name: "Săli de sport", iconUrl: '/icons/gym-icon.svg' }
};

const typeOfAmenities = amenities.map(type => {
  const details = amenityDetails[type];
  return {
    type,
    name: details.name,
    iconUrl: details.iconUrl,
    icon: L.icon({
      iconUrl: details.iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  };
});

const amenityCache = ref({});

const amenitiesMarkers = ref([]);
const selectedAmenityType = ref(typeOfAmenities[0].type);

import { fetchNearestPlaces } from '../../api/map.js'

const initializeMap = async () => {
  const romaniaBounds = getRomanianBounds();

  const mapCenter = ref([props.item.meta?.lat || 47.21322, props.item.meta?.lng || -1.559482]);
  const mapZoom = ref(13);

  map = L.map('map-item', {
    maxZoom: 18,
    minZoom: 8,
  }).setView(mapCenter.value, mapZoom.value);

  // Create a new marker cluster group
  markersCluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 50,
    iconCreateFunction: (cluster) => {
      return createClusterIcon(cluster.getChildCount())
    }
  });
  map.addLayer(markersCluster);

  // Set max bounds to keep the map restricted within Romania
  map.setMaxBounds(romaniaBounds);

  // Optionally, you can set options to disable dragging outside bounds
  map.options.maxBoundsViscosity = 1;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    opacity: 1
  }).addTo(map);

  let circle = L.circle([props.item.meta.lat, props.item.meta.lng], {
    radius: 500,
    color: 'blue',
    fillOpacity: 0.1
  }).addTo(map);

  //map.fitBounds(circle.getBounds(), { padding: [20, 20] });
}

const loadAmenities = async () => {
  const { lat, lng } = props.item.meta;
  const cacheKey = `${lat},${lng},${selectedAmenityType.value}`;

  // Check if the data is already in the cache
  if (amenityCache.value[cacheKey]) {
    currentPlaces.value = amenityCache.value[cacheKey]
    updateAmenitiesMarkers(amenityCache.value[cacheKey]);
    return;
  }

  // Fetch data if not cached
  const { data: { value: places } } = await fetchNearestPlaces(lat, lng, selectedAmenityType.value);

  // Cache the data
  amenityCache.value[cacheKey] = places;

  currentPlaces.value = places

  // Update markers on the map
  updateAmenitiesMarkers(places);
};

const updateAmenitiesMarkers = (places) => {
  markersCluster.clearLayers();

  // Clear existing markers and clusters
  amenitiesMarkers.value.forEach(marker => marker.remove());
  amenitiesMarkers.value = [];

  // Define a default icon as a fallback
  const defaultIcon = L.icon({
    iconUrl: '/icons/default-icon.svg', // Path to your default SVG icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Create a bounds object to track marker positions
  const bounds = L.latLngBounds();

  // Add markers to the cluster group
  // Add markers with detailed data and popups
  places.forEach(({ name, dist_meters, lat, long, type }) => {
    const amenity = typeOfAmenities.find(amenity => amenity.type === type);
    const icon = amenity ? amenity.icon : defaultIcon;

    const marker = L.marker([lat, long], { icon, data: { name, dist_meters, type } })
      .bindPopup(`
            <div class='bg-white text-gray-800 font-bold shadow-md'>
              <strong>${name}</strong><br>
              Distance: ${(dist_meters / 1000).toFixed(2)} km distanţă
            </div>`);

    markersCluster.addLayer(marker)
    amenitiesMarkers.value.push(marker)

     // Extend the bounds to include this marker
     bounds.extend([lat, long]);
  });

   // Adjust the map to fit the bounds of the new markers
   if (places.length > 0) {
    map.fitBounds(bounds, { padding: [20, 20] });
  }
};

const changeAmenityType = (type) => {
  selectedAmenityType.value = type;
  loadAmenities();
}


// Helper function to create a dynamic icon based on the cluster count
function createClusterIcon(count) {
  const baseSize = 20;                // Base icon size for small clusters
  const maxSize = 40;                 // Maximum icon size for large clusters
  const scalingFactor = 5;            // Controls how quickly the icon grows

  // Calculate icon size using a capped scaling based on the square root of the count
  const iconSize = Math.min(baseSize + Math.sqrt(count) * scalingFactor, maxSize);

  return L.divIcon({
    className: '',  // No additional class is needed here since TailwindCSS will handle styling through inline HTML
    html: `<div class="flex items-center justify-center rounded-full bg-white text-gray-800 font-bold shadow-md" 
                style="width: ${iconSize}px; height: ${iconSize}px;">
               ${count}
             </div>`,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2]
  });
}

watch(() => props.activeTab, (newTab) => {
  if (newTab == 'map' && !map) {
    nextTick(async () => {
      await initializeMap()
      await loadAmenities()
    });
  }
}, { immediate: true });

</script>

<style>
.swiper-slide-templates .swiper-slide-templates-slide {
  width: auto !important;
  display: inline-block;
}
</style>
