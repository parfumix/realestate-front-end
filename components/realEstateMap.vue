<template>
  <ClientOnly>
    <div id="map" style="width: 100%; height: 100%;" />

    <Teleport v-if="selectedItem" :to="`.popup-content-${selectedItem.id}`">
      <RealEstateListItem :item="selectedItem" :hideBookmark="true" />
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const { $currencyFormat } = useNuxtApp();

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

let map;
let markersCluster;
let selectedItem = ref(null);

const handleSelectCurrentItem = (item) => {
  selectedItem.value = item;
};

// Function to initialize the map and set up event listeners for preloading images
function initializeMap() {
  const defaultCenter = [-37.82, 175.23];
  const defaultZoom = 13;
  map = L.map('map').setView(defaultCenter, defaultZoom);

  L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  markersCluster = L.markerClusterGroup();
  map.addLayer(markersCluster);

  // Listen for cluster open event to preload images
  markersCluster.on('clusterclick', (event) => {
    preloadClusterImages(event.layer.getAllChildMarkers());
  });

  // Listen to map move end event to preload images for visible markers
  map.on('moveend', () => {
    preloadVisibleMarkers();
  });
}

// Function to create a custom marker icon with price
function createPriceIcon(price) {
  const formattedPrice = $currencyFormat(price);
  const baseWidth = 50;
  const extraWidthPerChar = 5;
  const iconWidth = baseWidth + (formattedPrice.length * extraWidthPerChar);

  return L.divIcon({
    className: 'bg-white rounded-[15px] text-center px-2 py-1 font-bold text-sm text-gray-800 shadow-md',
    html: `<div class="text-gray-800">${formattedPrice}</div>`,
    iconSize: [iconWidth, 30],
    iconAnchor: [iconWidth / 2, 15]
  });
}

// Function to update markers based on props.items
function updateMarkers() {
  markersCluster.clearLayers();

  const newMarkers = [];
  props.items.forEach((item) => {
    let { meta: { lat, lng } = {}, price } = item;

    if (lat && lng) {
      const marker = L.marker([lat, lng], {
        icon: createPriceIcon(price),
        item // Add item data to marker options for easy access
      });

      const popupContainerId = `popup-content-${item.id}`;
      marker.bindPopup('<div></div>', {
        closeButton: false,
        keepInView: true,
        className: `min-w-[200px] max-h-[100px] ${popupContainerId}`
      });

      newMarkers.push(marker);

      marker.on('popupopen', () => {
        handleSelectCurrentItem(item);
      });

      marker.on('popupclose', () => {
        handleSelectCurrentItem(null);
      });
    }
  });

  markersCluster.addLayers(newMarkers);

  if (newMarkers.length > 0) {
    map.fitBounds(markersCluster.getBounds(), { padding: [50, 50] });
  } else {
    map.setView([-37.82, 175.23], 13);
  }
}

// Function to preload images for markers in a cluster
function preloadClusterImages(markers) {
  markers.forEach((marker) => {
    const item = marker.options.item;
    if (item && item.meta.images && item.meta.images[0]) {
      preloadImage(item.meta.images[0]);
    }
  });
}

// Function to preload images for markers currently visible in map bounds
function preloadVisibleMarkers() {
  const bounds = map.getBounds();
  markersCluster.eachLayer((marker) => {
    if (bounds.contains(marker.getLatLng())) {
      const item = marker.options.item;
      if (item && item.meta.images && item.meta.images[0]) {
        preloadImage(item.meta.images[0]);
      }
    }
  });
}

// Helper function to preload an image
function preloadImage(src) {
  const img = new Image();
  img.src = src;
}

onMounted(async () => {
  await nextTick();
  initializeMap();
  updateMarkers();
});

watch(
  () => props.items,
  () => {
    updateMarkers();
  },
  { deep: true }
);
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}

.leaflet-popup-content-wrapper {
  background: transparent !important;
  box-shadow: none !important;
}

.leaflet-popup-tip-container {
  display: none;
}
</style>
