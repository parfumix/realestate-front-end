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
import { ref, onMounted, watch } from 'vue';
import { useWikimapia } from '~/composables/useWikimapia'; // Import the new composable

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

const templateRef = ref(null);

const templateSlideNext = () => {
  return templateRef.value.slideNext();
};
const templateSlidePrev = () => {
  return templateRef.value.slidePrev();
};

const mapCenter = ref([props.item.meta?.lat || 47.21322, props.item.meta?.lng || -1.559482]);
const mapZoom = ref(13);

let map;
let circle;

const typeOfAmenities = [
  {
    type: "school",
    name: "Școli",
    icon: L.icon({
      iconUrl: '/icons/school-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "hospital",
    name: "Spitale",
    icon: L.icon({
      iconUrl: '/icons/hospital-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "pharmacy",
    name: "Farmacii",
    icon: L.icon({
      iconUrl: '/icons/pharmacy-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "supermarket",
    name: "Supermarketuri",
    icon: L.icon({
      iconUrl: '/icons/supermarket-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "park",
    name: "Parcuri",
    icon: L.icon({
      iconUrl: '/icons/park-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "restaurant",
    name: "Restaurante",
    icon: L.icon({
      iconUrl: '/icons/restaurant-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "cafe",
    name: "Cafenele",
    icon: L.icon({
      iconUrl: '/icons/cafe-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "bank",
    name: "Bănci",
    icon: L.icon({
      iconUrl: '/icons/bank-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "bus_station",
    name: "Stații de autobuz",
    icon: L.icon({
      iconUrl: '/icons/bus-station-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "library",
    name: "Biblioteci",
    icon: L.icon({
      iconUrl: '/icons/library-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "gym",
    name: "Săli de sport",
    icon: L.icon({
      iconUrl: '/icons/gym-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "shopping_mall",
    name: "Centre comerciale",
    icon: L.icon({
      iconUrl: '/icons/shopping-mall-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    type: "parking",
    name: "Parcări",
    icon: L.icon({
      iconUrl: '/icons/parking-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  }
];

const amenitiesMarkers = ref([]);
const selectedAmenityType = ref(typeOfAmenities[0].type);

const { places, fetchNearestPlaces, loading, error } = useWikimapia();

// Initialize map and layers
onMounted(() => {
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

async function loadAmenities() {
  const { lat, lng } = props.item.meta;
  await fetchNearestPlaces(lat, lng, selectedAmenityType.value);

  // Clear existing markers
  amenitiesMarkers.value.forEach(marker => marker.remove());
  amenitiesMarkers.value = [];

  // Define a default icon as a fallback
  const defaultIcon = L.icon({
    iconUrl: '../../icons/default-icon.svg', // Path to your default SVG icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Add new markers for each place with the correct icon
  places.value.forEach(({ title, distance, location, type }) => {
    // Find the matching amenity type to get the icon
    const amenity = typeOfAmenities.find(amenity => amenity.type === type);
    const icon = amenity ? amenity.icon : defaultIcon; // Use defaultIcon if no match is found

    const marker = L.marker([location.lat, location.lon], { icon })
      .addTo(map)
      .bindPopup(`<strong>${title}</strong><br>Distance: ${distance} meters`);
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
}
</style>
