<template>
    <FormInput id="price" :required="true" :name="name" :label="title" placeholder="Preț" v-model="value"
        :error="errorMessage" />
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup';

const props = defineProps({
    name: String,
    title: String,
});

const { value, errorMessage } = useField(() => props.name, yup
    .number()
    .typeError('Prețul trebuie să fie un număr valid') // Error for non-numeric input
    .positive('Prețul trebuie să fie mai mare decât 0') // Enforce positive values
    .required('Prețul este obligatoriu') // Mark as required
);
</script>
