<template>
  <ClientOnly>
    <div class="map-container">

      <!-- List of unique amenities -->
      <ul>
        <li v-for="amenity in amenities" :key="amenity">{{ amenity }}</li>
      </ul>

      <LMap ref="map" :zoom="mapZoom" :center="mapCenter" :useGlobalLeaflet="false" style="height: 400px; width: 100%">
        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap" />
        <LCircle v-if="item.meta?.lat && item.meta?.lng" :lat-lng="[item.meta?.lat, item.meta?.lng]" :radius="radius" />
      </LMap>
    </div>
  </ClientOnly>
</template>

<script setup>

// https://chatgpt.com/share/67139b69-a568-8006-9f13-57639e6aafa7

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LCircle } from '@vue-leaflet/vue-leaflet';
import { ref } from 'vue';

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

const amenities = ref([]);

const fetchAmenities = async () => {
  const { data, error } = await useFetch(() => {
    const query = `
        [out:json][timeout:25];
        (
          node["amenity"](47.20000,-1.60000,47.22000,-1.54000);
          way["amenity"](47.20000,-1.60000,47.22000,-1.54000);
          relation["amenity"](47.20000,-1.60000,47.22000,-1.54000);
        );
        out body;
        >;
        out skel qt;
      `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    return $fetch(url);
  });

  // Compute unique amenities
  const amenities = ref([]);
  if (data.value?.elements?.length > 0) {
    amenities.value = [...new Set(data.value.elements.map(a => a.tags.amenity))];
  }
}

onMounted(async () => {
  await fetchAmenities()
})

// Center the map based on item's lat and lng
const mapCenter = ref([props.item.meta?.lat || 47.21322, props.item.meta?.lng || -1.559482]);

// Dynamically adjust the zoom level to fit the circle
const mapZoom = ref(13); // Initial zoom level
if (props.radius > 0) {
  mapZoom.value = Math.max(14 - Math.log2(props.radius / 500), 1); // Adjust zoom level based on radius
}

</script>

<style>
.map-container {
  height: 100%;
  /* Ensure the map container takes full available height */
}
</style>
