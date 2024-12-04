<template>
  <div style="width: 100%; height: 100%;">
    <div id="map" v-show="[chatStore.TYPE_MAP_ITEMS, chatStore.TYPE_LIST_HYBRID].includes(defaultView) || currentPageType=='saved'" style="width: 100%; height: 100%;" />
    <Teleport v-if="selectedItem" :to="`.popup-content-${selectedItem.internal_id}`">
      <RealEstateListItem :renderedInMap="true" :item="selectedItem" :hideBookmark="true" />
    </Teleport>
  </div>
</template>

<script setup>
import L from 'leaflet';
import "overlapping-marker-spiderfier-leaflet/dist/oms";
const OverlappingMarkerSpiderfier = window.OverlappingMarkerSpiderfier;

const filterStore = useFilterStore()
const { activeMessage, mapZoom, mapBbox } = storeToRefs(filterStore)
import { getRomanianBounds } from '../utils'

import { useThrottle } from '~/composables/useThrottle';

const chatStore = useChatStore()
const { mapItems, triggeredRefreshMap, hoveredItem } = storeToRefs(chatStore)

const { $currencyFormat } = useNuxtApp();

const emit = defineEmits(['moveend'])

const props = defineProps({
  defaultView: {
    type: String
  }
})

let map;
let spiderfier;
let markersCluster;

let isFetching = false
let isMovingMap = true

const route = useRoute();
const currentPageType = ref(route.name)

let selectedItem = ref(null);
const fetchClustersThrottled = useThrottle(fetchClusters, 700);

const handleSelectCurrentItem = (item) => {
  selectedItem.value = item;
}

// Function to initialize the map
const initializeMap = async() => {
  const romaniaBounds = getRomanianBounds();

  const defaultZoom = mapZoom.value;

  const defaultCenter = mapBbox.value
    ? [
        (mapBbox.value[1] + mapBbox.value[3]) / 2,
        (mapBbox.value[0] + mapBbox.value[2]) / 2,
      ]
    : [45.90529985724799, 24.895019531250004]; // Default center if mapBbox not available

  map = L.map('map', {
    scrollWheelZoom: false,
    maxZoom: 18,
    minZoom: 6,
  }).setView(defaultCenter, defaultZoom);

  // Set max bounds to keep the map restricted within Romania
  map.setMaxBounds(romaniaBounds);

  // Optionally, you can set options to disable dragging outside bounds
  map.options.maxBoundsViscosity = 1;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    opacity: 1
  }).addTo(map);

  markersCluster = L.layerGroup();
  map.addLayer(markersCluster);

  // Initialize OverlappingMarkerSpiderfier
  spiderfier = new OverlappingMarkerSpiderfier(map, {
    keepSpiderfied: true,
    nearbyDistance: 30,            // Distance threshold for spiderfying
    circleFootSeparation: 40,      // Separation for circular layout
    spiralFootSeparation: 50,      // Separation for spiral layout
    circleStartAngle: Math.PI / 6, // Starting angle for circular layout
    spiralLengthStart: 20,         // Starting length of the spiral
    spiralLengthFactor: 10,         // Tightness of the spiral
    legWeight: 1.5,                // Thickness of the spiderfy lines (legs)
    legColors: {
      usual: '#3e92c9',            // Default line color, e.g., orange-red
      highlighted: '#67bdf5'       // Highlighted line color, e.g., yellow
    }
  });

  // Set up spiderfy events
  spiderfier.addListener('click', (marker) => {
    // if (!map.getBounds().contains(marker.getLatLng())) {
    //   map.flyTo(marker.getLatLng(), map.getZoom() + 2);
    // }

    marker.openPopup();
  });

  // Listener for when markers are spiderfied (expanded around a central point)
  spiderfier.addListener('spiderfy', (markers) => {
    markers.forEach(marker => {
      marker.setIcon(createPriceIcon(marker.options.feature.price));
    });

    map.closePopup();
  });

  // Listener for when markers are unspiderfied (return to original positions)
  spiderfier.addListener('unspiderfy', (markers) => {
    // Handle individual markers
    markers.forEach(marker => {
      marker.setIcon(createPriceIcon(marker.options.feature.price));
    });

    // Optionally reset cluster icons (if clusters need to reflect unspiderfy state)
    markersCluster.eachLayer(layer => {
      if (layer instanceof L.Marker && layer.options.feature?.cluster) {
        layer.setIcon(createClusterIcon(layer.options.feature.point_count));
      }
    });
  });

  // Load and add the world GeoJSON to the map with a light fill
  await fetch('/world.geo.json')
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
  await fetch('/ro.geo.json')
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
  map.on('moveend', fetchClustersThrottled);
}

// Function to fetch clusters based on map bounds and zoom level
async function fetchClusters() {
  if(isFetching) return

  isMovingMap = true
  isFetching = true

  const bounds = map.getBounds();
  const zoom = map.getZoom();

  const bbox = [
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth()
  ];

  try {
    filterStore.setMapFilters(zoom, bbox)

    currentPageType.value == 'saved'
      ? emit('moveend', null, { only_saved: true }, { zoom: mapZoom.value, bbox: mapBbox.value })
      : emit('moveend', activeMessage.value, filterStore.activeFilters, { zoom: mapZoom.value, bbox: mapBbox.value })
  } catch (error) {
    console.error("Error during fetchClusters:", error);
  } finally {
    isFetching = false
  }
}

// Function to update markers based on fetched cluster data
function updateMarkers(clusterData) {
  markersCluster.clearLayers();
  spiderfier.clearMarkers();
  const newBounds = L.latLngBounds(); // Initialize bounds object

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

    newBounds.extend(L.latLng(lat, lng));

    if (feature.properties?.cluster) {
      const pointCount = feature.properties.point_count; // Number of markers in the cluster

      const marker = L.marker([lat, lng], {
        icon: createClusterIcon(pointCount), // Create dynamic icon based on count
        feature: feature.properties // Set custom options here
      });

      marker.on('click', () => {
        map.setView([lat, lng], map.getZoom() + 2);
      });

      markersCluster.addLayer(marker);
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
        feature: feature.properties // Set custom options here
      });

      const popupContainerId = `popup-content-${id}`;
      marker.bindPopup('<div></div>', {
        closeButton: false,
        keepInView: true,
        autoPan: false,
        className: `min-w-[200px] max-h-[100px] ${popupContainerId}`
      });

      marker.on('popupopen', () => handleSelectCurrentItem(feature.properties));
      marker.on('popupclose', () => handleSelectCurrentItem(null));

      coordinateMap.get(coordinateKey).push(marker);

      markersCluster.addLayer(marker);
      spiderfier.addMarker(marker);
    }
  });

  // Automatically trigger spiderfy by simulating a click on markers at the same location
  coordinateMap.forEach((markers) => {
    if (markers.length > 1) {
      markers[0].fire('click'); // Programmatically trigger a click event
    }
  });

  // Fit the map to the bounds of all markers
  if(clusterData.length && newBounds.isValid() && ! isMovingMap) {
      isFetching = true

      map.fitBounds(newBounds, { padding: [50, 50], animate: true } )
      filterStore.setMapFilters(map.getZoom(), newBounds.toBBoxString().split(',').map(coord => parseFloat(coord)))

      setTimeout(() => {
        isFetching = false
      }, 500)
    } else {
      isMovingMap = false
    }
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
function createPriceIcon(price, divClassName = 'bg-white', textClassName = 'text-gray-800') {
  const formattedPrice = $currencyFormat(price);
  const baseWidth = 50;
  const extraWidthPerChar = 5;
  const iconWidth = baseWidth + (formattedPrice.length * extraWidthPerChar);

  return L.divIcon({
    className: `rounded-[15px] text-center px-2 py-1 font-bold text-sm shadow-md ${divClassName}`,
    html: `<div class="${textClassName}">${formattedPrice}</div>`,
    iconSize: [iconWidth, 30],
    iconAnchor: [iconWidth / 2, 15]
  });
}

watch(() => hoveredItem.value, (internal_id) => {
  if (!map || !internal_id) return;

  markersCluster.eachLayer((marker) => {
    if(! marker.options?.feature?.id) return

    if (marker.options.feature.internal_id === internal_id) {
      marker.setIcon(createPriceIcon(marker.options.feature.price, 'bg-black', 'text-gray-100'));
    } else {
      marker.setIcon(createPriceIcon(marker.options.feature.price));
    }
  });
});

watch(() => triggeredRefreshMap.value, async(newVal) => {
  if(newVal === true) {
    await fetchClusters()
    chatStore.handleTriggerRefreshMap(false)
  }
})

watch(() => props.defaultView, (newView) => {
  const isAllowedToInitilizeMap = [chatStore.TYPE_MAP_ITEMS, chatStore.TYPE_LIST_HYBRID].includes(newView) || currentPageType.value == 'saved'

  if (isAllowedToInitilizeMap && !map) {
    nextTick(async() => {
      await initializeMap()
      updateMarkers(mapItems.value);
    });
  }
}, { immediate: true });

watch(() => mapItems.value, (newVal) => {
  if(! map) return
  setTimeout(() => {
    updateMarkers(newVal);
  })
}, { deep: true, immediate: true })
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
