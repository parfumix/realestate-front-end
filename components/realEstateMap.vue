<template>
  <div style="width: 100%; height: 100%;">
    <div id="map" v-show="[itemsStore.TYPE_MAP_ITEMS, itemsStore.TYPE_LIST_HYBRID].includes(defaultView) || currentPageType=='saved'" style="width: 100%; height: 100%;" />
    <Teleport v-if="selectedItem" :to="`.popup-content-${selectedItem.id}`">
      <RealEstateListItem :renderedInMap="true" :item="selectedItem" :hideBookmark="true" />
    </Teleport>
  </div>
</template>

<script setup>
import L from 'leaflet';
import "overlapping-marker-spiderfier-leaflet/dist/oms";
const OverlappingMarkerSpiderfier = window.OverlappingMarkerSpiderfier;

const filterStore = useFilterStore()
const { mapZoom, mapBbox } = storeToRefs(filterStore)
import { getRomanianBounds, useThrottle, debounce } from '../utils'

const itemsStore = useItemsStore()

const { mapItems, mapBounds, triggeredRefreshMap, hoveredItem, defaultView } = storeToRefs(itemsStore)

const { $currencyFormat } = useNuxtApp();

const emit = defineEmits(['moveend'])

let map = null;
let spiderfier = null;
let markersCluster = null;
let lastView = null;

let isProcessingRequest = false
let isProgrammaticMapMovement = true

const route = useRoute();
const currentPageType = ref(route.name)

// Track if the map events are currently disabled
const mapEventsDisabled = ref(false);

let selectedItem = ref(null);
const handleMapMoveEndThrottled = useThrottle(handleMapMoveEnd, 700);

// Track if the map has been initialized
const isMapInitialized = ref(false);

const handleSelectCurrentItem = (item) => {
  selectedItem.value = item;
}

// Function to temporarily disable map events
const disableMapEvents = () => {
  mapEventsDisabled.value = true;
}

// Function to re-enable map events
const enableMapEvents = (delay = 500) => {
  setTimeout(() => {
    mapEventsDisabled.value = false;
  }, delay);
}

// Function to initialize the map
const initializeMap = async() => {
  try {
    const romaniaBounds = getRomanianBounds();

    const defaultZoom = mapZoom.value || 7; // Fallback zoom if not set

    const defaultCenter = mapBbox.value
      ? [
          (mapBbox.value[1] + mapBbox.value[3]) / 2,
          (mapBbox.value[0] + mapBbox.value[2]) / 2,
        ]
      : [45.90529985724799, 24.895019531250004]; // Default center if mapBbox not available

    map = L.map('map', {
      scrollWheelZoom: false,
      maxZoom: 18,
      minZoom: 7,
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
      spiralLengthFactor: 10,        // Tightness of the spiral
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

    // Load and add Romania's GeoJSON with only the border displayed
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
    map.on('moveend', handleMapMoveEndThrottled);

    // Set the map as initialized
    isMapInitialized.value = true;
  } catch(err) {
    isMapInitialized.value = false;
    console.error("Error initializing map:", err);
  }
}

// Function to handle map size updates when container changes
const refreshMap = () => {
  if (map) {
    // Disable map events during refresh
    disableMapEvents();
    
    // Force a rerender of the map by triggering a resize event
    map.invalidateSize();

    // Re-enable map events after the refresh is complete
    enableMapEvents(500);
  }
}

const setNewLocationBasedOnItems = (updatedBounds) => {
  const [minLng, minLat, maxLng, maxLat] = updatedBounds;

  const newBounds = L.latLngBounds(
    [minLat, minLng], // Southwest corner
    [maxLat, maxLng]  // Northeast corner
  );

  // Fit the map to the bounds of all markers
  if(updatedBounds.length && newBounds.isValid() && !isProgrammaticMapMovement) {
    isProcessingRequest = true

    map.fitBounds(newBounds, { padding: [80, 80], animate: true, maxZoom: 14 });

    // Get the current bounds and convert to bbox format
    const bounds = newBounds.toBBoxString().split(',').map(coord => parseFloat(coord));
    const zoom = map.getZoom();
    
    // Update zoom and bbox in the store
    filterStore.setMapFilters(zoom, bounds);
    
    setTimeout(() => {
      isProcessingRequest = false
    }, 500)
  } else {
    isProgrammaticMapMovement = false
  }
}

// Function to fetch clusters based on map bounds and zoom level
async function handleMapMoveEnd() {
  if (isProcessingRequest || mapEventsDisabled.value) return;

  isProgrammaticMapMovement = true
  isProcessingRequest = true

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
    emit('moveend', { zoom: mapZoom.value, bbox: mapBbox.value })
  } catch (error) {
    console.error("Error during handleMapMoveEnd:", error);
  } finally {
    isProcessingRequest = false
  }
}

// Function to update markers based on fetched cluster data
function updateMarkers(clusterData) {
  markersCluster.clearLayers();
  spiderfier.clearMarkers();

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
      const { price, id, images } = feature.properties;
      const coordinateKey = `${lat},${lng}`;

      if (!coordinateMap.has(coordinateKey)) {
        coordinateMap.set(coordinateKey, []);
      }

      // Preload marker image if `image_url` exists
      if (images && images.length > 0) {
        preloadImage(images[0]);
      }

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

watch(() => hoveredItem.value, (id) => {
  if (!map || !id) return;

  markersCluster.eachLayer((marker) => {
    if(! marker.options?.feature?.id) return

    if (marker.options.feature.id === id) {
      marker.setIcon(createPriceIcon(marker.options.feature.price, 'bg-black', 'text-gray-100'));
    } else {
      marker.setIcon(createPriceIcon(marker.options.feature.price));
    }
  });
});

// Handle refresh map trigger
watch(() => triggeredRefreshMap.value, async(newVal) => {
  if(newVal === true) {
    await handleMapMoveEnd();
    itemsStore.handleTriggerRefreshMap(false);
  }
});

// Watch for view changes to initialize or refresh map
watch(() => defaultView.value, (newView, oldView) => {
  const isAllowedToInitilizeMap = [itemsStore.TYPE_MAP_ITEMS, itemsStore.TYPE_LIST_HYBRID].includes(newView) || currentPageType.value == 'saved';

  // Track view change for container width change detection
  lastView = oldView;

  if (isAllowedToInitilizeMap) {
    if (!isMapInitialized.value && !map) {
      // Initialize map if not yet initialized
      nextTick(async() => {
        await initializeMap();

        // Update markers with initial data
        updateMarkers(mapItems.value);
      });
    } else if (map) {
      // If view changed and map exists, refresh it to handle size changes
      nextTick(() => {
        refreshMap();
      });
    }
  }
}, { immediate: true });

watch(() => mapBounds.value, (newVal) => {
  if(! map) return
  setTimeout(() => {
    setNewLocationBasedOnItems(newVal);
  })
}, { deep: true, immediate: true })

watch(() => mapItems.value, (newVal) => {
  if(! map) return
  setTimeout(() => {
    updateMarkers(newVal);
  })
}, { deep: true, immediate: true })

// Use resize observer to detect container size changes
onMounted(() => {
  // Add a debounced version of refreshMap to prevent multiple refreshes
  const debouncedRefresh = debounce(() => {
    if (map && isMapInitialized.value) {
      // Disable events before resize handling
      refreshMap();
      
      setTimeout(() => {
        isProcessingRequest = false;
        // Re-enable events after resize handling is complete
        enableMapEvents(500);
      }, 500);
    }
  }, 500);
  
  const resizeObserver = new ResizeObserver(entries => {
    if (entries.length > 0) {
      disableMapEvents();
      isProcessingRequest = true;

      debouncedRefresh();
    }
  });
  
  const mapEl = document.getElementById('map');
  if (mapEl) {
    resizeObserver.observe(mapEl);
  }
  
  // Clean up observer on component unmount
  onUnmounted(() => {
    resizeObserver.disconnect();
  });
});
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