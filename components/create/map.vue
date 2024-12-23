<template>
    <div class="flex flex-col h-full relative">
        <!-- Address Input -->
        <div class="flex flex-col items-center p-4 absolute top-0 inset-0 z-[9999] h-[50px]">
            <div class="w-full relative rounded-md shadow-sm focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-4">
                <input :id="id" autocomplete="off" v-model="address" @input="debouncedSearchAddress" class="border-0 rounded w-full p-2 pr-[40px] ring-1 ring-gray-400 focus:ring-0	focus-within:outline-0 focus-within:outline-none" placeholder="Introduceți locația exactă a adresei dumneavoastră.." />
                <div v-if="isLoading" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <LoaderCircle class="animate-spin -ml-1 h-5 w-5 text-black" />
                </div>
            </div>
            <ul v-if="suggestions.length" class="border bg-white w-full mt-2 rounded shadow">
                <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)" class="p-2 cursor-pointer hover:bg-gray-200">
                    {{ suggestion.display_name }}
                </li>
            </ul>
        </div>

        <!-- Map -->
        <div id="map-item" class="relative" style="height: 100%; width: 100%;" />
    </div>
</template>

<script setup>
import { LoaderCircle } from 'lucide-vue-next'

import L from 'leaflet';
import debounce from 'lodash-es/debounce';
import "leaflet/dist/leaflet.css";

import { getRomanianBounds } from '../utils'

const props = defineProps({
    id: {
        type: String, 
        required: true
    },
    error: {
        type: String, 
        required: false,
        default: null
    }
})

const isLoading = ref(false);
const suggestions = ref([]);

const userLocation = JSON.parse(localStorage.getItem('userLocation') ?? '{}')
const selectedLocation = ref({ lat: userLocation?.lat ?? 44.4268, lng: userLocation?.lng ?? 26.1025 });
const address = ref(userLocation?.street);

const isLoadingLocation = ref(false);
let map;
let marker;

const initializeMap = async () => {
    const romaniaBounds = getRomanianBounds();

    // Initialize Leaflet map
    map = L.map('map-item', {
        maxZoom: 18,
        minZoom: 6,
        zoomControl: false, // Disable default zoom control
    }).setView([selectedLocation.value.lat, selectedLocation.value.lng], 13);

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
    marker = L.marker([selectedLocation.value.lat, selectedLocation.value.lng], { draggable: true }).addTo(map);

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

const searchAddress = async () => {
    if (!address.value) {
        suggestions.value = [];
        return;
    }

    try {
        isLoading.value = true;

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address.value)}&countrycodes=RO&format=json&addressdetails=1&limit=5`
        );
        const data = await response.json();
        suggestions.value = data;
    } catch (error) {
        console.error('Error fetching address suggestions:', error);
    } finally {
        isLoading.value = false;
    }
};

const selectSuggestion = (suggestion) => {
    // Update selected location and map
    const { lat, lon, address: suggestedAddress, display_name } = suggestion;
    selectedLocation.value = { lat: parseFloat(lat), lng: parseFloat(lon), county: suggestedAddress?.county, street: display_name };

    // Move marker and map to the selected location
    map.setView([lat, lon], 13);
    marker.setLatLng([lat, lon]);

    // Clear suggestions
    address.value = suggestion.display_name;
    suggestions.value = [];
};

const reverseGeocode = async (lat, lng) => {
    try {
        isLoading.value = true
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
        );
        const data = await response.json();

        const { address: suggestedAddress, display_name } = data;
        selectedLocation.value = { lat: parseFloat(lat), lng: parseFloat(lng), county: suggestedAddress?.county, street: display_name };

        address.value = data.display_name;
    } catch (error) {
        console.error('Error fetching reverse geocoding data:', error);
    } finally {
        isLoading.value = false
    }
};

watch(() => selectedLocation.value, (newVal) => {
    localStorage.setItem('userLocation', JSON.stringify(newVal))
})

const detectUserLocation = async () => {
    isLoadingLocation.value = true;
    if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        isLoadingLocation.value = false;
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

            isLoadingLocation.value = false;
        },
        (error) => {
            console.error('Error detecting user location:', error);
            isLoadingLocation.value = false;
        }
    );
};

const debouncedSearchAddress = debounce(searchAddress, 300);

onMounted(async () => {
    if (!userLocation?.lat && !userLocation?.lng) {
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
