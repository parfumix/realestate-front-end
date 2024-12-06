<template>
    <div class="h-[calc(100dvh-150px)]">
      <!-- Address Input -->
      <div class="flex flex-col items-center p-4">
        <label for="address" class="text-sm font-medium text-gray-700">Enter Address</label>
        <input
          id="address"
          v-model="address"
          @input="debouncedSearchAddress"
          class="border rounded w-full p-2"
          placeholder="Enter address to sell your property"
        />
        <ul v-if="suggestions.length" class="border bg-white w-full mt-2 rounded shadow">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @click="selectSuggestion(suggestion)"
            class="p-2 cursor-pointer hover:bg-gray-200"
          >
            {{ suggestion.display_name }}
          </li>
        </ul>
      </div>
  
      <!-- Map -->
      <div id="map-item" style="height: 50%; width: 100%;" />
    </div>
  </template>

<script setup>
import L from 'leaflet';
import debounce from 'lodash-es/debounce';
import "leaflet/dist/leaflet.css";

const address = ref('');
const suggestions = ref([]);
const selectedLocation = ref({ lat: 47.21322, lng: -1.559482 }); // Default coordinates
let map;
let marker;

const initializeMap = () => {
  // Initialize Leaflet map
  map = L.map('map-item').setView([selectedLocation.value.lat, selectedLocation.value.lng], 13);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker to the map
  marker = L.marker([selectedLocation.value.lat, selectedLocation.value.lng], { draggable: true }).addTo(map);

  // Update coordinates and address when the marker is dragged
  marker.on('dragend', async (e) => {
    const { lat, lng } = e.target.getLatLng();
    await reverseGeocode(lat, lng);
  });
};

const searchAddress = async () => {
  if (!address.value) {
    suggestions.value = [];
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address.value)}&countrycodes=RO&format=json&addressdetails=1&limit=5`
    );
    const data = await response.json();
    suggestions.value = data;
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
  }
};

const selectSuggestion = (suggestion) => {
  // Update selected location and map
  const { lat, lon, address: suggestedAddress, display_name } = suggestion;
  selectedLocation.value = { lat: parseFloat(lat), lng: parseFloat(lon), county: suggestedAddress?.county, street: display_name  };

  // Move marker and map to the selected location
  map.setView([lat, lon], 13);
  marker.setLatLng([lat, lon]);

  // Clear suggestions
  address.value = suggestion.display_name;
  suggestions.value = [];
};

const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
    );
    const data = await response.json();

    const { address: suggestedAddress, display_name } = data;
    selectedLocation.value = { lat: parseFloat(lat), lng: parseFloat(lng), county: suggestedAddress?.county, street: display_name  };

    address.value = data.display_name;
  } catch (error) {
    console.error('Error fetching reverse geocoding data:', error);
  }
};

const debouncedSearchAddress = debounce(searchAddress, 300);

onMounted(() => {
  initializeMap();
});

onUnmounted(() => {
  if (map) {
    map.off();
    map.remove();
  }
});
</script>
