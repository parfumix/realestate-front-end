<template>
    <FormSelect id="parking" :required="false" :name="name" :options="parkingOptions"
        :label="title" placeholder="Select" v-model="value" :error="errorMessage" />
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
});

const parkingOptions = [
    { "value": "open", "label": "Deschis" },
    { "value": "garage", "label": "Garaj" },
    { "value": "covered", "label": "Sub acoperiș" },
    { "value": "underground", "label": "Subterană" }
]

const { value, errorMessage } = useField(() => props.name, yup
    .mixed()
    .oneOf(['open', 'garage', 'covered', 'underground'])
    .optional()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable());
</script>