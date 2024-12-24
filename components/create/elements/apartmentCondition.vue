<template>
    <FormSelect id="apartmentCondition" :name="name" :options="apartmentConditionOptions" :label="title"
        placeholder="Select" v-model="value" :error="errorMessage" />
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
});

const apartmentConditionOptions = [
    { "value": "demolition-house", "label": "Casă de demolat" },
    { "value": "custom-design", "label": "Design individual" },
    { "value": "no-renovation", "label": "Fără reparație" },
    { "value": "in-use", "label": "Dat în exploatare" },
    { "value": "unfinished-construction", "label": "Construcție nefinisată" },
    { "value": "needs-repair", "label": "Are nevoie de reparație" },
    { "value": "gray-finish", "label": "Variantă sură" },
    { "value": "white-finish", "label": "Variantă albă" },
    { "value": "cosmetic-renovation", "label": "Reparație cosmetică" },
    { "value": "euro-renovation", "label": "Euroreparație" }
]

const { value, errorMessage } = useField(() => props.name, yup
    .mixed()
    .oneOf([
        'demolition-house',
        'custom-design',
        'no-renovation',
        'in-use',
        'unfinished-construction',
        'needs-repair',
        'gray-finish',
        'white-finish',
        'cosmetic-renovation',
        'euro-renovation',
    ])
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .optional()
    .nullable());
</script>