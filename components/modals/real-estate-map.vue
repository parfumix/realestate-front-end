<template>
  <ClientOnly>
    <div class="map-container">
      <div id="map-item" style="height: 400px; width: 100%"></div>
    </div>

    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <a v-for="tab in typeOfAmenities" :key="tab.name" href="#"
          :class="[tab?.current ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700', 'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium']"
          :aria-current="tab.current ? 'page' : undefined">
          {{ tab?.name }}
          <span v-if="tab?.count"
            :class="[tab.current ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900', 'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block']">{{
              tab.count }}</span>
        </a>
      </nav>
    </div>

    <!-- <select v-model="selectedAmenityType" @change="fetchAndDisplayAmenities">
        <option v-for="type in typeOfAmenities" :key="type" :value="type">{{ type }}</option>
      </select> -->

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
  { type: "school", name: "School" },
  { type: "hospital", name: "Hospital" },
  { type: "pharmacy", name: "Pharmacy" },
  { type: "restaurant", name: "Restaurant" },
  { type: "cafe", name: "Cafe" },
  { type: "bank", name: "Bank" },
  { type: "atm", name: "ATM" },
  { type: "bus_station", name: "Bus Station" },
  { type: "train_station", name: "Train Station" },
  { type: "subway", name: "Subway" },
  { type: "police", name: "Police Station" },
  { type: "fire_station", name: "Fire Station" },
  { type: "library", name: "Library" },
  { type: "gym", name: "Gym" },
  { type: "park", name: "Park" },
  { type: "playground", name: "Playground" },
  { type: "cinema", name: "Cinema" },
  { type: "shopping_mall", name: "Shopping Mall" },
  { type: "supermarket", name: "Supermarket" },
  { type: "parking", name: "Parking Lot" }
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
