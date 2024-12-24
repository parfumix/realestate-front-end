<template>
    <FormSelect id="roomCount" :required="true" name="roomCount" :options="roomCountOptions" :label="title"
        placeholder="Select" v-model="value" :error="errorMessage" />
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
});

const roomCountOptions = [
    { "value": "1", "label": "O cameră" },
    { "value": "1", "label": "1 cameră" },
    { "value": "2", "label": "2 camere" },
    { "value": "3", "label": "3 camere" },
    { "value": "4", "label": "4 camere" },
    { "value": "5", "label": "5 camere sau mai multe" }
]

const { value, errorMessage } = useField(() => props.name, yup
    .number()
    .typeError('Numărul de camere trebuie să fie un număr')
    .required('Numărul de camere este obligatoriu'));
</script>