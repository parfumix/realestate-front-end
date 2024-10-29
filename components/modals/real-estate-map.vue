<template>
  <ClientOnly>
    <div class="map-container">
      <div id="map-item" style="height: 400px; width: 100%"></div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

import L from 'leaflet';
import "leaflet/dist/leaflet.css";

// Props to accept a single item and radius
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  radius: {
    type: Number,
    default: 500 // Default radius in meters for the circle
  },
});

// Center and Zoom based on item's location
const mapCenter = ref([props.item.meta?.lat || 47.21322, props.item.meta?.lng || -1.559482]);
const mapZoom = ref(13);

const areaName = 'București' // Replace with the actual area name

const query = `
  [out:json];
  area["name"="${areaName}"]->.searchArea;
  node["amenity"](area.searchArea);
  out body;
`

// URL for the Overpass API with encoded query
const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

// Fetch data using useFetch
const { data, error } = await useFetch(url)

// Access fetched data
const amenities = ref([])

onMounted(() => {
  if (data.value) {
    amenities.value = data.value.elements
  }
})

// Initialize map and layers
let map;
let circle;

onMounted(async () => {
  await nextTick()

  // Initialize Leaflet map
  map = L.map('map-item').setView(mapCenter.value, mapZoom.value);

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Add circle if item's coordinates are available
  if (props.item.meta?.lat && props.item.meta?.lng) {
    circle = L.circle([props.item.meta.lat, props.item.meta.lng], {
      radius: props.radius,
      color: 'blue',
      fillOpacity: 0.1
    }).addTo(map);

    // Fit map view to circle radius
    map.fitBounds(circle.getBounds(), { padding: [20, 20] });
  }
});

// Watch for changes in radius to adjust zoom level and circle radius
watch(() => props.radius, (newRadius) => {
  if (circle) {
    circle.setRadius(newRadius);
    map.fitBounds(circle.getBounds(), { padding: [20, 20] });
  }
});

// Watch for changes in item location to re-center the map
watch(
  () => props.item.meta,
  (newMeta) => {
    if (newMeta?.lat && newMeta?.lng) {
      map.setView([newMeta.lat, newMeta.lng], mapZoom.value);
      if (circle) {
        circle.setLatLng([newMeta.lat, newMeta.lng]);
      } else {
        circle = L.circle([newMeta.lat, newMeta.lng], {
          radius: props.radius,
          color: 'blue',
          fillOpacity: 0.1
        }).addTo(map);
      }
    }
  },
  { deep: true }
);
</script>

<style>
.map-container {
  height: 100%;
}
</style>
