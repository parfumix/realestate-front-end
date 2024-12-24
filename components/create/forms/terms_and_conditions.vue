<template>
    <FormCheckbox id="terms_and_conditions" v-model="value" :error="errorMessage">
        {{ title }} <RouterLink target="_blank" class="underline text-blue-600" to="terms-and-conditions">termenii și
            condițiile</RouterLink>
    </FormCheckbox>
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
});

const { value, errorMessage } = useField(() => props.name, yup.boolean()
    .oneOf([true], 'Trebuie să acceptați Termenii și Condițiile')
    .required('Trebuie să acceptați Termenii și Condițiile'));
</script>