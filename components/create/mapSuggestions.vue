<template>
    <div class="flex flex-col items-center absolute top-0 inset-0 z-[900]">
        <div class="w-full rounded-md shadow-sm">
            <FormInput :id="id" :name="id" autocomplete="off" :required="true" @input="debouncedSearchAddress"  :label="label" :placeholder="placeholder ?? 'Introduceți locația exactă a adresei dumneavoastră..'" v-model="modelValue" :error="errorMessage">
                <template #rightMessage>
                    <div v-if="isLoading" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <LoaderCircle class="animate-spin -ml-1 h-5 w-5 text-black" />
                    </div>
                </template>

                <template #default>
                    <ul v-if="suggestions.length" class="border bg-white w-full mt-2 rounded shadow">
                        <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)" class="p-2 cursor-pointer hover:bg-gray-200">
                            {{ suggestion.display_name }}
                        </li>
                    </ul>
                </template>
            </FormInput>
        </div>
    </div>
</template>

<script setup>
import debounce from 'lodash-es/debounce';
import { LoaderCircle } from 'lucide-vue-next'

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: false,
        default: null,
    },
    placeholder: {
        type: String,
        required: false,
        default: null,
    },
    errorMessage: {
        type: String,
        required: false,
        default: null,
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
        const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(modelValue.value)}&countrycodes=RO&format=json&addressdetails=1&limit=5&extratags=1&class=place&type=[city|town|village]`;

        const response = await fetch(searchUrl);
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