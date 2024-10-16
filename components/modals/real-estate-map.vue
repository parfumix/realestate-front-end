<template>
    <ClientOnly>
      <div class="map-container">
        <LMap
          ref="map"
          :zoom="mapZoom"
          :center="mapCenter"
          :useGlobalLeaflet="false"
          style="height: 400px; width: 100%"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          />
          <LCircle
            v-if="item.lat && item.lng"
            :lat-lng="[item.lat, item.lng]"
            :radius="radius"
          />
        </LMap>
      </div>
    </ClientOnly>
  </template>
  
  <script setup>
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
  
  // Center the map based on item's lat and lng
  const mapCenter = ref([props.item.lat || 47.21322, props.item.lng || -1.559482]);
  
  // Dynamically adjust the zoom level to fit the circle
  const mapZoom = ref(13); // Initial zoom level
  if (props.radius > 0) {
    mapZoom.value = Math.max(14 - Math.log2(props.radius / 500), 1); // Adjust zoom level based on radius
  }
  
  </script>
  
  <style>
  .map-container {
    height: 100%; /* Ensure the map container takes full available height */
  }
  </style>
  