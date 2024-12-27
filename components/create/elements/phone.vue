<template>
    <div id="phone">
        <div v-for="(phone, index) in phones" :key="index" class="flex flex-col mb-4">
            <FormInput :id="`${index}-phone`" :disabled="phone.verified" :required="true" :input-class="[phone.verified ? 'bg-gray-200' : '', index > 0 ? 'pl-10' : '']" v-model="phone.phone_number" :name="`${name}-${index}`" :label="`${title} ${index== 0 ? '' : index+1}`" placeholder="+40 712 345 678" :error="errorMessages[index]">
                <template #prefix>
                    <CircleX v-if="index>0" @click="() => handleRemovePhoneNumber(phone.phone_number, index)" size="20" class="cursor-pointer text-red-600 ml-2" />
                </template>
                <template #actions>
                    <button v-if="! phone.verified" :disabled="!isPhoneValid(index)"  @click="() => openValidationModal(index)" type="button" class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <BadgeCheck size="14" />
                        Confirma
                    </button>
                </template>
            </FormInput>

        </div>
        <p v-if="phones.length < ALLOW_MAX_PHONES && isLastPhoneValid" @click="handleAddPhoneNumber">Adauga numar de telefon</p>
    </div>
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

import { BadgeCheck, CircleX } from "lucide-vue-next"

import { useModalStore } from '@/stores/modals';
import OptPhoneModal from '@/components/auth-modals/otp-phone.vue';

const modalStore = useModalStore();

const { fetchPhoneNumbers, addPhoneNumber, deletePhoneNumber } = useAuthService()

const props = defineProps({
    name: String,
    title: String,
});

const ALLOW_MAX_PHONES = 2

let silentAddPhone = false

const phones = ref([])
const errorMessages = reactive({})

// Phone validation schema
const phoneSchema = yup.string()
  .required('Numărul de telefon este obligatoriu')
  .matches(
    /^(?:\+40\s?7\d{2}\s?\d{3}\s?\d{3}|\+373\s?\d{2,3}\s?\d{2}\s?\d{3})$/,
    'Numărul de telefon trebuie să fie în format valid (+40 7XX XXX XXX sau +373 XXX XX XXX)'
  );

// Field validation for form submission
const { value, errorMessage } = useField(() => props.name, yup.string()
    .required('Cel puțin un număr de telefon valid este necesar'))


watch(() => errorMessage.value, newval => {
    errorMessages[0] = newval
}, { deep: true })

// Validate individual phone number
const validatePhone = async (phoneNumber, index) => {
    try {
        await phoneSchema.validate(phoneNumber)
        errorMessages[index] = ''
        return true
    } catch (error) {
        errorMessages[index] = error.message
        return false
    }
}

const isPhoneValid = (index) => {
    return !errorMessages[index] && phones.value[index]?.phone_number
}

const openValidationModal = (index) => {
    if (isPhoneValid(index)) {
        modalStore.openModal(OptPhoneModal, {
            phoneNumber: phones.value[index].phone_number,
            dialogStyles: 'sm:w-full sm:max-w-xl h-[70%]'
        }, async() => {
            await addPhoneNumber(phones.value[index].phone_number, true)

            // save phone number to database
            handleUpdatePhoneNumber(index, {
                phone_number: phones.value[index].phone_number, 
                verified: true
            })
        })
    }
}

const handleUpdatePhoneNumber = async (index, newPhoneNumber) => {
    if (index < 0 || index >= phones.value.length)
        return;

    phones.value[index] = newPhoneNumber;
}

const isLastPhoneValid = computed(() => {
    try {
        const lastPhoneAdded = phones.value.length ? phones.value[phones.value.length - 1] : null
        if(! lastPhoneAdded) return false

        if(! lastPhoneAdded.phone_number || !lastPhoneAdded.verified) throw new Error('Invalid phone')
        phoneSchema.validateSync(lastPhoneAdded.phone_number)
        return true
    } catch(err) {
        return false
    }
})

watch(() => phones.value, async(newPhones) => {
    if(silentAddPhone) return

    // Validate each phone number
    for (let i = 0; i < newPhones.length; i++) {
        await validatePhone(newPhones[i].phone_number, i)
    }

    // Update form validation state
    const verifiedPhones = newPhones.filter(phone => phone.verified)
    value.value = verifiedPhones.length > 0 ? 'true' : ''
}, { deep: true })

const handleAddPhoneNumber = () => {
    if(phones.length > ALLOW_MAX_PHONES) return

    // if previous phone numbers and last one it's not valid than prevent adding new one
    if(phones.value?.length > 0) {
        if(! isLastPhoneValid.value) return
    }

    silentAddPhone = true
    phones.value.push({
        phone_number: '',
        verified: false
    })
    setTimeout(() => silentAddPhone = false)
}

const handleRemovePhoneNumber = async(phone, idx) => {
    await deletePhoneNumber(phone)

    phones.value.splice(idx, 1)
    delete errorMessages[idx]

    if(! phones.value.length) {
        handleAddPhoneNumber()
    }
}

onMounted(async() => {
    const phone_numbers = await fetchPhoneNumbers()

    for(let { phone_number, verified } of phone_numbers) {
        phones.value.push({
            phone_number,
            verified
        })
    }

    // if no numbers trigger to add one phone number
    if(! phones.value.length) {
        handleAddPhoneNumber()
    }
})
</script>
