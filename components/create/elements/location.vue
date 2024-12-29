<template>
    <div class="relative">
        <CreateMapSuggestions :id="props.name" :label="title" :placeholder="description" v-model="value" :errorMessage="errorMessage" @select="handleSelectSuggestion" />
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
    value.value = street
    location.value = { lat, lon, county, street }
}

watch(() => location.value, ({ street }) => {
    value.value = street
})

const { value, errorMessage } = useField(() => props.name, yup
    .string()
    .required('Locația este obligatorie')
    .min(5, 'Locația trebuie să aibă cel puțin 5 caractere')
    .max(100, 'Locația poate avea maximum 100 de caractere'));

onMounted(() => {
    value.value = location.value?.street
})
</script>