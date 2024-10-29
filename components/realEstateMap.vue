<template>
  <ClientOnly>
    <div id="map" style="width: 100%; height: 100%;" />
  </ClientOnly>
</template>

<script setup>
import { onMounted, nextTick, watch } from 'vue';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

let map; // Declare map globally to access it in the watcher
let markers; // Declare markers globally to reset them

// Function to initialize the map
function initializeMap() {
  const defaultCenter = [-37.82, 175.23]; // Default coordinates
  const defaultZoom = 13; // Default zoom level

  // Create map instance
  map = L.map('map').setView(defaultCenter, defaultZoom);

  // Add tile layer to map
  L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

// Function to update markers based on items
function updateMarkers() {
  // Clear existing markers if they exist
  if (markers) {
    markers.clearLayers();
  } else {
    markers = L.markerClusterGroup();
  }

  const markerCoordinates = [];

  // Loop through items to create markers
  props.items.forEach(({ meta: { lat, lng } = {}, title }) => {
    if (lat && lng) { // Ensure lat/lng exist
      const marker = L.marker([lat, lng], { title });
      marker.bindPopup(title || 'No title available');
      markers.addLayer(marker);
      markerCoordinates.push([lat, lng]);
    }
  });

  // Add updated markers to the map
  map.addLayer(markers);

  // Fit map to markers or default view if no markers are available
  if (markerCoordinates.length > 0) {
    map.fitBounds(L.latLngBounds(markerCoordinates), { padding: [50, 50] });
  } else {
    map.setView([-37.82, 175.23], 13); // Default view if no markers
  }
}

onMounted(async () => {
  await nextTick();

  // Initialize the map
  initializeMap();

  // Initial marker setup
  updateMarkers();
});

// Watch for changes in props.items to update markers
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
</style>
