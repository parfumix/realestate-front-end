<template>
    <FormInput id="phone" :required="true" :name="name" :label="title" placeholder="Telefon" v-model="value"
        :error="errorMessage" />
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
    .matches(
        /^(07\d{8}|02\d{7}|03\d{7})$/,
        'Numărul de telefon trebuie să fie valid și să aibă 10 cifre'
    )
    .required('Numărul de telefon este obligatoriu'));
</script>