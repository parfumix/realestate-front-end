<template>
  <ClientOnly>
    <LMap
      ref="map"
      :zoom="6"
      :center="mapCenter"
      :useGlobalLeaflet="false"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />
      <LMarker
        v-for="(el, index) in elements"
        :key="index"
        :lat-lng="[el?.lat, el?.lng]"
      >
      </LMarker>
    </LMap>
  </ClientOnly>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';

const map = ref(null);

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

const elements = ref([]);
const mapCenter = ref([47.21322, -1.559482]);

// Watch for changes to items and update elements
watch(
  () => props.items,
  (newItems) => {
    elements.value = newItems.map(item => ({
      ...item,
      lat: item.lat,
      lng: item.lng,
    }));
  },
  { deep: true, immediate: true }
);
</script>
