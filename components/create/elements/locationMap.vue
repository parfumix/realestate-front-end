<template>
    <CreateMap v-model="value" id="location_map" :error="errorMessage" class="w-full h-full" />
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
});

const { value, errorMessage } = useField(() => props.name, yup
    .string()
    .required('Locația este obligatorie')
    .min(5, 'Locația trebuie să aibă cel puțin 5 caractere')
    .max(100, 'Locația poate avea maximum 100 de caractere'));
</script>