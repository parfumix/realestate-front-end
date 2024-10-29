<template>
  <ClientOnly>
    <div class="map-container">
      <div id="map-item" style="height: 400px; width: 100%"></div>
    </div>

    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <a v-for="tab in typeOfAmenities" :key="tab.name" href="#"
          :class="[tab?.current ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700', 'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium']"
          :aria-current="tab.current ? 'page' : undefined"
          @click.prevent="changeAmenityType(tab.type)">
          {{ tab?.name }}
        </a>
      </nav>
    </div>
  </ClientOnly>
</template>

<script setup>
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  radius: {
    type: Number,
    default: 500
  },
});

const mapCenter = ref([props.item.meta?.lat || 47.21322, props.item.meta?.lng || -1.559482]);
const mapZoom = ref(13);

let map;
let circle;

const amenitiesMarkers = ref([]);
const selectedAmenityType = ref("school");

const { amenities, fetchAmenities, loading, error } = useOverpass();

const typeOfAmenities = [
  { type: "school", name: "School" },
  { type: "hospital", name: "Hospital" },
  { type: "pharmacy", name: "Pharmacy" },
  { type: "supermarket", name: "Supermarket" },
  { type: "park", name: "Park" },
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
  { type: "playground", name: "Playground" },
  { type: "cinema", name: "Cinema" },
  { type: "shopping_mall", name: "Shopping Mall" },
  { type: "parking", name: "Parking Lot" }
];

// Initialize map and layers
onMounted(async () => {
  await nextTick();
  initializeMap();
  loadAmenities();
});

function initializeMap() {
  map = L.map('map-item').setView(mapCenter.value, mapZoom.value);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  if (props.item.meta?.lat && props.item.meta?.lng) {
    circle = L.circle([props.item.meta.lat, props.item.meta.lng], {
      radius: props.radius,
      color: 'blue',
      fillOpacity: 0.1
    }).addTo(map);
    map.fitBounds(circle.getBounds(), { padding: [20, 20] });
  }
}

// Load amenities and place markers
async function loadAmenities() {
  await fetchAmenities(selectedAmenityType.value, props.item.meta?.lat, props.item.meta?.lng, props.radius);

  // Clear existing markers
  amenitiesMarkers.value.forEach(marker => marker.remove());
  amenitiesMarkers.value = [];

  // Add new markers
  amenities.value.forEach(element => {
    const marker = L.marker([element.lat, element.lon])
      .addTo(map)
      .bindPopup(`<strong>${selectedAmenityType.value}</strong><br>${element.tags?.name || "Unnamed"}`);
    amenitiesMarkers.value.push(marker);
  });
}

function changeAmenityType(type) {
  selectedAmenityType.value = type;
  loadAmenities();
}

// Watch for changes in radius or location
watch(() => props.radius, () => {
  if (circle) {
    circle.setRadius(props.radius);
    map.fitBounds(circle.getBounds(), { padding: [20, 20] });
    loadAmenities();
  }
});

watch(() => props.item.meta, (newMeta) => {
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
    loadAmenities();
  }
}, { deep: true });
</script>

<style>
.map-container {
  height: 100%;
}
</style>
