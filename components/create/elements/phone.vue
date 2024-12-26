<template>
    <div id="phone">
        <div v-for="(phone, index) in phones" :key="index" class="flex flex-col mb-4">
            <FormInput :id="`${index}-phone`" :required="true" :input-class="[index > 0 ? 'pl-10' : '']" v-model="phone.phone_number" :name="`${name}-${index}`" :label="`${title} ${index+1}`" placeholder="+40 712 345 678" :error="''">
                <template #prefix>
                    <CircleX v-if="index > 0" @click="() => handleRemovePhoneNumber(index)" size="20" class="cursor-pointer text-red-600 ml-2" />
                </template>
                <template #actions>
                    <button v-if="! phone.verified" @click="openValidationModal" type="button" class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <BadgeCheck size="14" />
                        Confirma
                    </button>
                </template>
            </FormInput>

        </div>
        <p v-if="phones.length < ALLOW_MAX_PHONES" @click="handleAddPhoneNumber">Adauga numar de telefon</p>
    </div>
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

import { BadgeCheck, CircleX } from "lucide-vue-next"

import { useModalStore } from '@/stores/modals';
import OptPhoneModal from '@/components/auth-modals/otp-phone.vue';

const modalStore = useModalStore();

const { fetchPhoneNumbers } = useAuthService()

const props = defineProps({
    name: String,
    title: String,
});

const openValidationModal = () => {
    modalStore.openModal(OptPhoneModal);
}

const ALLOW_MAX_PHONES = 2

const phones = ref([])
const errorMessages = reactive({})


const { value, errorMessage } = useField(() => props.name,  yup.string()
    .required('Numărul de telefon este obligatoriu'));

watch(() => phones.value, newval => {
    const parsedItems = JSON.parse(JSON.stringify(newval))
    const isPhoneValid = parsedItems.filter(el => el.verfied)

    value.value = isPhoneValid.length ? 'true' : false
}, { deep: true })

const handleAddPhoneNumber = () => {
    if(phones.length > ALLOW_MAX_PHONES) return

    phones.value.push({
        phone_number: '',
        verified: false
    })
}

const handleRemovePhoneNumber = (idx) => {
    phones.value.splice(idx, 1)
}

onMounted(async() => {
    const phone_numbers = await fetchPhoneNumbers()

    for(let { phone_number, verified } of phone_numbers) {
        phones.value.push({
            phone_number,
            verified
        })
    }
})
</script>