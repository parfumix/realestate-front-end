<template>
  <ClientOnly>
    <div class="map-container">
      <div id="map-item" style="height: 400px; width: 100%"></div>
      <select v-model="selectedAmenityType" @change="fetchAndDisplayAmenities">
        <option v-for="type in typeOfAmenities" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

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

// Map and markers
let map;
let circle;
const mapCenter = ref([props.item.meta?.lat || 47.21322, props.item.meta?.lng || -1.559482]);
const mapZoom = ref(13);
const amenitiesMarkers = ref([]);
const selectedAmenityType = ref("school");

const typeOfAmenities = [
  "school",
  "hospital",
  "pharmacy",
  "restaurant",
  "cafe",
  "bank",
  "atm",
  "bus_station",
  "train_station",
  "subway",
  "police",
  "fire_station",
  "library",
  "gym",
  "park",
  "playground",
  "cinema",
  "shopping_mall",
  "supermarket",
  "parking"
];

// Initialize map and layers
onMounted(async () => {
  await nextTick();
  initializeMap();
  fetchAndDisplayAmenities();
});

function initializeMap() {
  map = L.map('map-item').setView(mapCenter.value, mapZoom.value);
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Add circle
  if (props.item.meta?.lat && props.item.meta?.lng) {
    circle = L.circle([props.item.meta.lat, props.item.meta.lng], {
      radius: props.radius,
      color: 'blue',
      fillOpacity: 0.1
    }).addTo(map);
    map.fitBounds(circle.getBounds(), { padding: [20, 20] });
  }
}

// Fetch amenities by type from Overpass API
async function fetchAndDisplayAmenities() {
  // Clear existing markers
  amenitiesMarkers.value.forEach(marker => marker.remove());
  amenitiesMarkers.value = [];

  const query = `
    [out:json];
    node
      ["amenity"="${selectedAmenityType.value}"]
      (around:5000,${props.item.meta?.lat},${props.item.meta?.lng});
    out;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    data.elements.forEach(element => {
      const marker = L.marker([element.lat, element.lon])
        .addTo(map)
        .bindPopup(`<strong>${selectedAmenityType.value}</strong><br>${element.tags?.name || "Unnamed"}`);
      amenitiesMarkers.value.push(marker);
    });
  } catch (error) {
    console.error("Error fetching amenities:", error);
  }
}

// Watch for changes in radius and item location
watch(() => props.radius, () => {
  if (circle) {
    circle.setRadius(props.radius);
    map.fitBounds(circle.getBounds(), { padding: [20, 20] });
    fetchAndDisplayAmenities();
  }
});

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
      fetchAndDisplayAmenities();
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
