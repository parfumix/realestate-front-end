<template>
    <div class="flex flex-col h-full relative">
        <div :id="id" class="relative" style="height: 100%; width: 100%;" />
    </div>
</template>

<script setup>
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { getRomanianBounds } from '../utils'

import { useLocationStore } from '@/stores/location';
import { storeToRefs } from 'pinia'

const props = defineProps({
    id: {
        type: String, 
        required: true
    }
})

const locationStore = useLocationStore()
const { location, isLoading } = storeToRefs(locationStore)

const DEFAULT_LAT = 44.4268
const DEFAULT_LON = 26.1025

let map;
let marker;

const initializeMap = async () => {
    const romaniaBounds = getRomanianBounds();

    // Initialize Leaflet map
    map = L.map(props.id, {
        maxZoom: 18,
        minZoom: 6,
        zoomControl: false, // Disable default zoom control
    }).setView([location.value?.lat ?? DEFAULT_LAT, location.value?.lon ?? DEFAULT_LON], 13);

    // Set max bounds to keep the map restricted within Romania
    map.setMaxBounds(romaniaBounds);

    // Optionally, you can set options to disable dragging outside bounds
    map.options.maxBoundsViscosity = 1;

    // Add a zoom control to the bottom-right corner
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add a marker to the map
    marker = L.marker([location.value?.lat ?? DEFAULT_LAT, location.value?.lon ?? DEFAULT_LON], { draggable: true }).addTo(map);

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

    // Update coordinates and address when the marker is dragged
    marker.on('dragend', async (e) => {
        const { lat, lng } = e.target.getLatLng();
        await reverseGeocode(lat, lng);
    });
};

watch(() => location.value, ({ lat, lon }) => {
    map.setView([lat, lon], 13);
    marker.setLatLng([lat, lon]);
})

const reverseGeocode = async (lat, lon) => {
    try {
        isLoading.value = true
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
        );
        const data = await response.json();

        const { address: suggestedAddress, display_name } = data;
        location.value = { lat: parseFloat(lat), lon: parseFloat(lon), county: suggestedAddress?.county, street: display_name };
    } catch (error) {
        console.error('Error fetching reverse geocoding data:', error);
    } finally {
        isLoading.value = false
    }
};

const detectUserLocation = async () => {
    isLoading.value = true;

    if (! navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        isLoading.value = false;
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await reverseGeocode(latitude, longitude);

            if (map) {
                map.setView([latitude, longitude], 13);
                marker.setLatLng([latitude, longitude]);
            }

            isLoading.value = false;
        },
        (error) => {
            console.error('Error detecting user location:', error);
            isLoading.value = false;
        }
    );
};

onMounted(async () => {
    if (! location.value?.lat && ! location.value?.lon) {
        detectUserLocation();
    }
    
    await initializeMap();
});

onUnmounted(() => {
    if (map) {
        map.off();
        map.remove();
    }
});
</script>
