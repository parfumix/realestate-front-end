<template>
    <div class="relative">
        <CreateMapSuggestions :id="props.name" :label="title" :placeholder="description" v-model="value.street" :errorMessage="errorMessage" @select="handleSelectSuggestion" />
    </div>
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
    description: String,
});

const locationStore = useLocationStore()
const { location } = storeToRefs(locationStore)

const handleSelectSuggestion = ({ lat, lon, county, street }) => {
    location.value = { lat, lon, county, street }
}

watch(() => location.value, ({ lat, lon, county, street }) => {
    value.value = { lat, lon, county, street }
    console.log(value.value)
})

const { value, errorMessage } = useField(() => props.name, yup
    .object({
        lat: yup.number().required(),
        lon: yup.number().required(),
        county: yup.string().optional(),
        street: yup.string().optional(),
    })
    .required('Locația este obligatorie')
);

onMounted(() => {
    value.value = location.value || { lat: null, lon: null, county: '', street: '' };
})
</script>