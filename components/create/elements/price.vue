<template>
    <FormInput id="price" type="number" input-class="pl-6" placeholder="123,456.00" :required="true" :name="name" :label="title" v-model="value" :error="errorMessage">
        <template v-slot:prefix>
            <Euro v-tooltip="`Prețul este indicat în euro`" class="ring-0 focus:ring-0 focus:outline-none text-gray-800 ml-2 cursor-pointer" size="14" />
        </template>
    </FormInput>
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup';

import { Euro } from "lucide-vue-next"

const props = defineProps({
    name: String,
    title: String,
});

const { value, errorMessage } = useField(() => props.name, yup
    .number()
    .typeError('Prețul trebuie să fie un număr') // Error for non-numeric input
    .positive('Prețul trebuie să fie mai mare decât 0') // Enforce positive values
    .required('Prețul este obligatoriu') // Mark as required
);
</script>
