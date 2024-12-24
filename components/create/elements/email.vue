<template>
    <FormInput id="email" :required="true" name="email" :label="title" placeholder="Email" type="email" v-model="value"
        :error="errorMessage" />
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
});

const { value, errorMessage } = useField(() => props.name, yup.string().email('Emailul este invalid').required('Emailul este obligatoriu'));
</script>