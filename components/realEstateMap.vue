<template>
  <LMap
    ref="mapRef"
    style="height: 100%; width: 100%;"
    :zoom="6"
    :center="mapCenter"
    :use-global-leaflet="false"
  >
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
      layer-type="base"
      name="OpenStreetMap"
    />

    <!-- Add a marker for each geocoded item -->
    <LMarker
      v-if="elements.length"
      v-for="(el, index) in elements"
      :key="index"
      :lat-lng="[el?.lat, el?.lng]"
    >
      <template v-slot:default>
        <div>
          <h4>{{ el?.title || 'No title' }}</h4>
          <p>Price: €{{ el?.price || 'N/A' }}</p>
          <p>{{ el?.street || 'Unknown location' }}</p>
        </div>
      </template>
    </LMarker>
  </LMap>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';

// Define props for items
const props = defineProps({
  items: {
    type: Object,
    default: () => {}, // Initialize as an empty array by default
  }
});

// Create an array to hold the geocoded elements
const elements = ref([]);

// Map center state
const mapCenter = ref([47.21322, -1.559482]);

// Function to geocode address to lat/lng using fetch and Nominatim API
const geocodeAddress = async (street) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(street)}&format=json&limit=1`);
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
  } catch (error) {
    console.error(`Error geocoding address "${street}":`, error);
  }
  return null; // Return null if geocoding fails
};

// Watch for changes to items prop and geocode them
watch(
  () => props.items,
  async (newItems) => {
    elements.value = []; // Clear previous elements
    for (const item of newItems) {
      const coords = await geocodeAddress(item.street);

      if (coords) {
        elements.value.push({
          ...item, // Spread the item object to retain other properties
          lat: coords.lat,
          lng: coords.lng
        });
      } else {
        console.error(`Could not geocode address: ${item.street}`);
      }
    }

    // Optionally, adjust the map center to the first geocoded item
    if (elements.value.length > 0 && elements.value[0].lat && elements.value[0].lng) {
      mapCenter.value = [elements.value[0].lat, elements.value[0].lng];
    }
  },
  { deep: true, immediate: true } // Watch deeply for changes within the array
);
</script>
