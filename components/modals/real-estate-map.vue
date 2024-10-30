<template>
  <ClientOnly>
    <div class="map-container">
      <div id="map-item" style="height: 400px; width: 100%"></div>
    </div>

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
          :class="[selectedAmenityType == tab.type ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700', 'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer']"
          :aria-current="selectedAmenityType == tab.type ? 'page' : undefined"
          @click.prevent="changeAmenityType(tab.type)">
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

const templateRef = ref(null)

const templateSlideNext = () => {
  return templateRef.value.slideNext()
}
const templateSlidePrev = () => {
  return templateRef.value.slidePrev()
}

const mapCenter = ref([props.item.meta?.lat || 47.21322, props.item.meta?.lng || -1.559482]);
const mapZoom = ref(13);

let map;
let circle;

const typeOfAmenities = [
  { type: "school", name: "Școli" },
  { type: "hospital", name: "Spitale" },
  { type: "pharmacy", name: "Farmacii" },
  { type: "supermarket", name: "Supermarketuri" },
  { type: "park", name: "Parcuri" },
  { type: "restaurant", name: "Restaurante" },
  { type: "cafe", name: "Cafenele" },
  { type: "bank", name: "Bănci" },
  { type: "bus_station", name: "Stații de autobuz" },
  { type: "library", name: "Biblioteci" },
  { type: "gym", name: "Săli de sport" },
  { type: "shopping_mall", name: "Centre comerciale" },
  { type: "parking", name: "Parcări" }
];

const amenitiesMarkers = ref([]);
const selectedAmenityType = ref(typeOfAmenities[0].type);

const { amenities, fetchAmenities, loading, error } = useOverpass();

// Initialize map and layers
onMounted(async () => {
  setTimeout(() => {
    initializeMap();
    loadAmenities();
  })
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
  await fetchAmenities(
    selectedAmenityType.value, props.item.meta?.lat, props.item.meta?.lng, props.radius
  );

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

.swiper-slide-templates .swiper-slide-templates-slide {
  width: auto !important;
  display: inline-block;
  /* Add any additional styling for the first slider */
}
</style>
