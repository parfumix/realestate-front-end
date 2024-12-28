<template>
    <div id="phone">
        <div class="flex flex-col items-center">
            <div class="flex justify-start">
                <FormCheckboxes :id="`phone-verified`" v-model="value" :options="verifiedPhoneNumbers" v-slot="slotProps">
                    <CircleX @click="() => handleRemovePhoneNumber(slotProps.option.label, true)" size="20" class="cursor-pointer text-red-600 ml-2" />
                </FormCheckboxes>
            </div>
            <p class="inline-block mt-2 text-sm text-red-600" v-if="errorMessage">{{ errorMessage }}</p>
        </div>

        <div v-for="(phone, index) in unverifiedPhoneNumbers" :key="index" class="flex flex-col mb-4">
            <FormInput :id="`${index}-phone`" :required="true" :input-class="`pl-10`" v-model="phone.phone_number" :name="`${name}-${index}`" :label="`${title} ${index== 0 ? '' : index+1}`" placeholder="+40 712 345 678" :error="errorMessages[index]">
                <template #prefix>
                    <CircleX @click="() => handleRemovePhoneNumber(phone.phone_number)" size="20" class="cursor-pointer text-red-600 ml-2" />
                </template>

                <template #actions>
                    <button :disabled="! isPhoneValid(index)" @click="() => openValidationModal(index)" type="button" class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
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

const { notify } = useNotification();

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
const { value, errorMessage } = useField(() =>
  props.name,
  yup.array().of(yup.string().required()).min(1, "At least one item is required").required()
);

const verifiedPhoneNumbers = computed(() => {
    return phones.value.filter(el => el.verified).map(el => {
        return {
            value: el.id,
            label: el.phone_number,
        }
    })
})

const unverifiedPhoneNumbers = computed(() => {
    return phones.value.filter(el => !el.verified)
})

// watch(() => errorMessage.value, newval => {
//     errorMessages[0] = newval
// }, { deep: true })

const isPhoneValid = (index) => {
    return !errorMessages[index] && phones.value[index]?.phone_number
}

const openValidationModal = (index) => {
    if (isPhoneValid(index)) {
        modalStore.openModal(OptPhoneModal, {
            phoneNumber: phones.value[index].phone_number,
            dialogStyles: 'sm:w-full sm:max-w-xl h-[70%]'
        }, async() => {
            // if confirmation is sucessfully than add phone number in database
            await addPhoneNumber(phones.value[index].phone_number, true)

            // save phone number to database
            handleUpdatePhoneNumber(index, {
                phone_number: phones.value[index].phone_number, 
                verified: true
            })
        })
    }
}

const handleUpdatePhoneNumber = async (index, newObjectPhoneNumber) => {
    if (index < 0 || index >= phones.value.length)
        return;

    phones.value[index] = newObjectPhoneNumber;
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

watch(() => unverifiedPhoneNumbers.value,(newPhones) => {
    if(silentAddPhone) return

    // Validate each phone numb er
    for (let i = 0; i < newPhones.length; i++) {
        try {
            phoneSchema.validateSync(newPhones[i].phone_number)
            errorMessages[i] = ''
        } catch(err) {
            errorMessages[i] = err.message
        }
    }
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

const handleRemovePhoneNumber = async(phone, is_verified = false) => {
    try {
        if(is_verified) {
            if(! confirm('Are you sure?')) {
                return
            }
        }
       
        const phoneIndex = phones.value.findLastIndex(el => el.phone_number == phone)
        if(phoneIndex === -1) return

        // if phone number have generate ID that means is from database
        if(phones.value?.[phoneIndex]?.id && is_verified) {
            await deletePhoneNumber(phone)
        }

        phones.value.splice(phoneIndex, 1)
        delete errorMessages[phoneIndex]

        if(! phones.value.length) {
            handleAddPhoneNumber()
        }
    } catch(err) {
        notify({
            title: 'Eroare!',
            text: err?.message || 'A apărut o eroare!',
            type: 'error',
        });
    }

}

onMounted(async() => {
    const phone_numbers = await fetchPhoneNumbers()

    for(let { id, phone_number, verified } of phone_numbers) {
        phones.value.push({
            id,
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
