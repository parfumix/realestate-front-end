<template>
    <div class="flex flex-col items-center p-4 absolute top-0 inset-0 z-[900] h-[50px]">
        <div class="w-full relative rounded-md shadow-sm focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-4">
            <input :id="id" autocomplete="off" v-model="modelValue" @input="debouncedSearchAddress" class="border-0 rounded w-full p-2 pr-[40px] ring-1 ring-gray-400 focus:ring-0	focus-within:outline-0 focus-within:outline-none" placeholder="Introduceți locația exactă a adresei dumneavoastră.." />
            <div v-if="isLoading" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <LoaderCircle class="animate-spin -ml-1 h-5 w-5 text-black" />
            </div>
        </div>
        <ul v-if="suggestions.length" class="border bg-white w-full mt-2 rounded shadow">
            <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)"
                class="p-2 cursor-pointer hover:bg-gray-200">
                {{ suggestion.display_name }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import debounce from 'lodash-es/debounce';
import { LoaderCircle } from 'lucide-vue-next'

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const locationStore = useLocationStore()
const { isLoading } = storeToRefs(locationStore)

const modelValue = defineModel({
    required: true,
});

const emit = defineEmits(['select'])

const suggestions = ref([]);

const searchAddress = async () => {
    if (! modelValue.value) {
        suggestions.value = [];
        return;
    }

    try {
        isLoading.value = true;
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(modelValue.value)}&countrycodes=RO&format=json&addressdetails=1&limit=5`
        );
        const data = await response.json();
        suggestions.value = data;
    } catch (error) {
        console.error('Error fetching address suggestions:', error);
    } finally {
        isLoading.value = false;
    }
};

const debouncedSearchAddress = debounce(searchAddress, 300);

const selectSuggestion = (suggestion) => {
    // Update selected location and map
    const { lat, lon, address: suggestedAddress, display_name } = suggestion;

    emit('select', { lat: parseFloat(lat), lon: parseFloat(lon), county: suggestedAddress?.county, street: display_name })

    // Clear suggestions
    modelValue.value = suggestion.display_name;
    suggestions.value = [];
};
</script>