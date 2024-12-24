<template>
    <FormInput id="totalArea" :required="true" :name="name" :label="title" placeholder="mp" v-model="value"
        :error="errorMessage" />
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
});

const { value, errorMessage } = useField(() => props.name, yup.number().typeError('Trebuie să fie un număr').required('Suprafața totală este obligatorie'));
</script>