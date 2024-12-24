<template>
    <FormSelect id="balcony" :required="false" :name="name" :options="balconyOptions"
        :label="title" placeholder="Select" v-model="value" :error="errorMessage" />
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
});

const balconyOptions = [
    { "value": "0", "label": "Nu" },
    { "value": "1", "label": "1" },
    { "value": "2", "label": "2" },
    { "value": "3", "label": "3" },
    { "value": "4", "label": "4 și mai multe" }
]

const { value, errorMessage } = useField(() => props.name, yup
    .number()
    .optional()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable());
</script>