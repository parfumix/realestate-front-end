<template>
    <FormRadioGroup :legend="title" :name="name" :options="transactionTypeOptions"
        v-model="value" :error="errorMessage" />
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
});
  
const transactionTypeOptions = [
    { value: 'sell', title: 'De vânzare' },
    { value: 'rent', title: 'De închiriat' },
]

const { value, errorMessage } = useField(() => props.name, yup.mixed().oneOf(['sell', 'rent']));
</script>