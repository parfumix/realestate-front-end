<template>
    <FormSelect id="floor" :required="true" name="floor" :options="floorOptions" :label="title" placeholder="Select"
        v-model="value" :error="errorMessage" />
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
});

const floorOptions = [
    { "value": "-2", "label": "Subsol" },
    { "value": "-1", "label": "Demisol" },
    { "value": "1", "label": "1" },
    { "value": "2", "label": "2" },
    { "value": "3", "label": "3" },
    { "value": "4", "label": "4" },
    { "value": "5", "label": "5" },
    { "value": "6", "label": "6" },
    { "value": "7", "label": "7" },
    { "value": "8", "label": "8" },
    { "value": "9", "label": "9" },
    { "value": "10", "label": "10" },
    { "value": "11", "label": "11" },
    { "value": "12", "label": "12" },
    { "value": "13", "label": "13" },
    { "value": "14", "label": "14" },
    { "value": "15", "label": "15" },
    { "value": "16", "label": "16" },
    { "value": "17", "label": "17" },
    { "value": "18", "label": "18" },
    { "value": "19", "label": "19" },
    { "value": "20", "label": "20" },
    { "value": "21", "label": "21" },
    { "value": "22", "label": "22" },
    { "value": "23", "label": "23" },
    { "value": "24", "label": "24" },
    { "value": "25", "label": "25" },
    { "value": "penthouse", "label": "Penthouse" },
    { "value": "attic", "label": "Mansardă" }
  ]

const { value, errorMessage } = useField(() => props.name, yup.number().typeError('Trebuie să fie un număr').required('Etajul este obligatoriu'));
</script>