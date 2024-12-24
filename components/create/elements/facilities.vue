<template>
    <div class="flex flex-row justify-between items-center">
        <div class="flex flex-col" v-for="items in distributeArray(facilities, 3)">
            <FormCheckboxes :options="items" v-model="value" :error="errorMessage" />
        </div>
    </div>
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'
import { distributeArray } from '../../../utils'

const props = defineProps({
    name: String,
    title: String,
});

const facilities = [
    { value: 'ready_to_move_in', label: 'Gata de mutat' },
    { value: 'annex', label: 'Anexă' },
    { value: 'terrace', label: 'Terasă' },
    { value: 'separate_entrance', label: 'Intrare separată' },
    { value: 'park_area', label: 'Zonă cu parc' },
    { value: 'furnished', label: 'Mobilat' },
    { value: 'with_household_appliances', label: 'Cu tehnică electrocasnică' },
    { value: 'autonomous_heating', label: 'Încălzire autonomă' },
    { value: 'air_conditioning', label: 'Aer condiționat' },
    { value: 'heated_floor', label: 'Podea cu încălzire' },
    { value: 'double_glazed_windows', label: 'Geamuri termopan' },
    { value: 'panoramic_windows', label: 'Geamuri panoramice' },
    { value: 'parquet', label: 'Parchet' },
    { value: 'laminate', label: 'Laminat' },
    { value: 'reinforced_door', label: 'Ușă blindată' },
    { value: 'phone_line', label: 'Linie telefonică' },
    { value: 'smart_home_system', label: 'Casă inteligentă' },
    { value: 'intercom', label: 'Interfon' },
    { value: 'internet', label: 'Internet' },
    { value: 'cable_tv', label: 'Cablu TV' },
    { value: 'alarm_system', label: 'Sistem de alarmă' },
    { value: 'video_surveillance', label: 'Supraveghere video' },
    { value: 'elevator', label: 'Ascensor' },
    { value: 'playground', label: 'Teren de joacă' },
]

const { value, errorMessage } = useField(() => props.name, yup.array().of(yup.string()).optional().nullable());
</script>