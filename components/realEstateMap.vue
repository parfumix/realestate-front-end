<template>
  <ClientOnly>
    <div id="map" style="width: 100%; height: 100%;" />

    <Teleport v-if="selectedItem" :to="`.popup-content-${selectedItem.id}`">
      <RealEstateListItem :item="selectedItem" />
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import L from 'leaflet';
import 'leaflet.markercluster';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const { $currencyFormat } = useNuxtApp();

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

let map; // Declare map globally to access in the watcher
let markersCluster; // Declare markers cluster globally for easy reset

let selectedItem = ref(null)
const handleSelectCurrentItem = (item) => {
  selectedItem.value = item
}

// Function to initialize the map
function initializeMap() {
  const defaultCenter = [-37.82, 175.23];
  const defaultZoom = 13;
  map = L.map('map').setView(defaultCenter, defaultZoom);

  L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  markersCluster = L.markerClusterGroup(); // Initialize cluster group
  map.addLayer(markersCluster); // Add the cluster group to the map
}

// Function to create a custom marker icon with price
function createPriceIcon(price) {
  const formattedPrice = $currencyFormat(price);
  
  // Estimate icon width based on the length of the formatted price text
  const baseWidth = 50; // Minimum width
  const extraWidthPerChar = 5; // Approximate additional width per character
  const iconWidth = baseWidth + (formattedPrice.length * extraWidthPerChar);

  return L.divIcon({
    className: 'bg-white rounded-[15px] text-center px-2 py-1 font-bold text-sm text-gray-800 shadow-md',
    html: `<div class="text-gray-800">${formattedPrice}</div>`,
    iconSize: [iconWidth, 30], // Dynamic width based on text length
    iconAnchor: [iconWidth / 2, 15] // Center the icon anchor
  });
}

// Function to update markers based on props.items
function updateMarkers() {
  markersCluster.clearLayers();

  const newMarkers = []; // Array to store new markers

  props.items.forEach((item) => {
    let { meta: { lat, lng } = {}, price } = item;

    if (lat && lng) {
      const marker = L.marker([lat, lng], { icon: createPriceIcon(price) });

      const popupContainerId = `popup-content-${item.id}`; // Unique ID for teleport target
      marker.bindPopup('<div></div>', { closeButton: false, keepInView: true, className: `min-w-[200px] max-h-[100px] ${popupContainerId}` }); // Simple popup for each marker
      newMarkers.push(marker); // Add marker to the array

      marker.on('popupopen', () => {
        handleSelectCurrentItem(item)
      });

      marker.on('popupclose', () => {
        handleSelectCurrentItem(null)
      });
    }
  });

  markersCluster.addLayers(newMarkers);

  if (newMarkers.length > 0) {
    map.fitBounds(markersCluster.getBounds(), { padding: [50, 50] });
  } else {
    map.setView([-37.82, 175.23], 13);
  }
}

onMounted(async () => {
  await nextTick();
  initializeMap();
  updateMarkers(); // Initialize markers
});

watch(
  () => props.items,
  () => {
    updateMarkers();
  },
  { deep: true }
);
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}

.leaflet-popup-content-wrapper {
  background: transparent !important;
  box-shadow: none !important;
}

.leaflet-popup-tip-container {
  display: none;
}
</style>
