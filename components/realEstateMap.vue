<template>
  <ClientOnly>
    <div id="map" style="width: 100%; height: 100%;" />

    <Teleport v-if="selectedItem" :to="`.popup-content-${selectedItem.internal_id}`">
      <RealEstateListItem :item="selectedItem" :hideBookmark="true" />
    </Teleport>
  </ClientOnly>
</template>

<script setup>
// watch chat for quuery
// search real estate properties when query present by quuery
// save default state on local storage is_map, is_list

import L from 'leaflet';
import "overlapping-marker-spiderfier-leaflet/dist/oms";
const OverlappingMarkerSpiderfier = window.OverlappingMarkerSpiderfier;

import { useCustomFetch } from '~/composables/useCustomFetch';
const { $currencyFormat } = useNuxtApp();

let map;
let spiderfier;
let markersCluster;

let selectedItem = ref(null);

const handleSelectCurrentItem = (item) => {
  selectedItem.value = item;
}

// Function to initialize the map
function initializeMap() {
  const defaultLatLngBucharest = [45.90529985724799, 24.895019531250004]
  const defaultCenter = defaultLatLngBucharest;
  const defaultZoom = 7;

  map = L.map('map', {
    maxZoom: 18,
    minZoom: 6,
  }).setView(defaultCenter, defaultZoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    opacity: 1
  }).addTo(map);

  markersCluster = L.layerGroup();
  map.addLayer(markersCluster);

  // Initialize OverlappingMarkerSpiderfier
  spiderfier = new OverlappingMarkerSpiderfier(map, {
    keepSpiderfied: true,
    nearbyDistance: 20, // Adjust as needed
  });

  // Set up spiderfy events
  spiderfier.addListener('click', (marker) => {
    marker.openPopup();
  });

  spiderfier.addListener('spiderfy', (markers) => {
    markers.forEach(marker => marker.setIcon(new L.Icon.Default({ iconUrl: L.Icon.Default.imagePath + '/marker-icon.png' })));
    map.closePopup();
  });

  spiderfier.addListener('unspiderfy', (markers) => {
    markers.forEach(marker => marker.setIcon(new L.Icon.Default({ iconUrl: L.Icon.Default.imagePath + '/marker-icon.png' })));
  });

  // Load and add the world GeoJSON to the map with a light fill
  fetch('/world.geo.json')
    .then(response => response.json())
    .then(worldData => {
      L.geoJSON(worldData, {
        style: {
          color: '#ccc',        // Border color for the world
          fillColor: '#ccc',    // Fill color for the world
          weight: 1,            // Border width
          opacity: 0.2,         // Border opacity for the world
          fillOpacity: 0.3     // Fill opacity to make it lighter
        }
      }).addTo(map);            // Add the layer to the map
    })
    .catch(error => console.error('Error loading world GeoJSON:', error));

  // Load and add Romania’s GeoJSON with only the border displayed
  fetch('/ro.geo.json')
    .then(response => response.json())
    .then(countryData => {
      L.geoJSON(countryData, {
        style: {
          color: '#808080',     // Border color for Romania
          weight: 2,            // Slightly thicker border
          opacity: 1,           // Full opacity for the border
          fillOpacity: 0        // No fill color (transparent)
        }
      }).addTo(map);            // Add the layer to the map
    })
    .catch(error => console.error('Error loading Romania GeoJSON:', error));


  // Fetch clusters initially and whenever the map view changes
  map.on('moveend', () => {
    fetchClusters()
  });
}

// Function to fetch clusters based on map bounds and zoom level
async function fetchClusters() {
  const bounds = map.getBounds();
  const zoom = map.getZoom();

  const bbox = [
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth()
  ];

  try {
    const { data, error } = await useCustomFetch('properties-clustered', {
      method: 'POST',
      body: {
        zoom: zoom,
        bbox: bbox
      }
    });

    if (error.value) {
      console.error("Error fetching clusters:", error.value);
      return;
    }

    updateMarkers(data.value);
  } catch (error) {
    console.error("Error during fetchClusters:", error);
  }
}

// Function to update markers based on fetched cluster data
function updateMarkers(clusterData) {
  markersCluster.clearLayers();
  spiderfier.clearMarkers();

  const bounds = L.latLngBounds();
  const coordinateMap = new Map();

  // Helper function to preload an image
  function preloadImage(url) {
    const img = new Image();
    img.src = url;
  }

  clusterData.forEach((feature) => {
    const [lng, lat] = feature.geometry.coordinates;

    if (!lat || !lng) {
      console.warn("Invalid coordinates for marker:", feature);
      return; // Skip this marker if it has invalid coordinates
    }

    if (feature.properties.cluster) {
      const pointCount = feature.properties.point_count; // Number of markers in the cluster

      const marker = L.marker([lat, lng], {
        icon: createClusterIcon(pointCount) // Create dynamic icon based on count
      });

      marker.on('click', () => {
        map.setView([lat, lng], map.getZoom() + 2);
      });

      markersCluster.addLayer(marker);
      bounds.extend([lat, lng]);
    } else {
      const { price, internal_id: id, meta } = feature.properties;
      const coordinateKey = `${lat},${lng}`;

      if (!coordinateMap.has(coordinateKey)) {
        coordinateMap.set(coordinateKey, []);
      }

      // Preload marker image if `image_url` exists
      preloadImage(meta?.images?.[0]);

      const marker = L.marker([lat, lng], {
        icon: createPriceIcon(price),
      });

      const popupContainerId = `popup-content-${id}`;
      marker.bindPopup('<div></div>', {
        closeButton: false,
        keepInView: true,
        className: `min-w-[200px] max-h-[100px] ${popupContainerId}`
      });

      marker.on('popupopen', () => handleSelectCurrentItem(feature.properties));
      marker.on('popupclose', () => handleSelectCurrentItem(null));

      coordinateMap.get(coordinateKey).push(marker);
      markersCluster.addLayer(marker);
      spiderfier.addMarker(marker);

      bounds.extend([lat, lng]);
    }
  });

  // Automatically trigger spiderfy by simulating a click on markers at the same location
  coordinateMap.forEach((markers) => {
    if (markers.length > 1) {
      markers[0].fire('click'); // Programmatically trigger a click event
    }
  });

  // if (bounds.isValid()) {
  //   map.fitBounds(bounds, { padding: [50, 50] });
  // }
}
// Helper function to create a dynamic icon based on the cluster count
function createClusterIcon(count) {
  const baseSize = 20;                // Base icon size for small clusters
  const maxSize = 40;                 // Maximum icon size for large clusters
  const scalingFactor = 5;            // Controls how quickly the icon grows

  // Calculate icon size using a capped scaling based on the square root of the count
  const iconSize = Math.min(baseSize + Math.sqrt(count) * scalingFactor, maxSize);

  return L.divIcon({
    className: '',  // No additional class is needed here since TailwindCSS will handle styling through inline HTML
    html: `<div class="flex items-center justify-center rounded-full bg-white text-gray-800 font-bold shadow-md" 
                style="width: ${iconSize}px; height: ${iconSize}px;">
               ${count}
             </div>`,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2]
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

// Initialize map on component mount
onMounted(async () => {
  await nextTick();
  initializeMap();
  fetchClusters();
})
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
