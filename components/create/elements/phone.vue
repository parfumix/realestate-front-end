<template>
    <div>
        <FormInput id="phone" :required="true" :name="name" :label="title" placeholder="+40 712 345 678" v-model="value":error="errorMessage">
            <template #actions>
                <button @click="openValidationModal" type="button" class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <BadgeCheck size="14" />
                    Confirma
                </button>
            </template>
        </FormInput>
    </div>
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'
import { BadgeCheck } from "lucide-vue-next"
import { useModalStore } from '@/stores/modals';
import OptPhoneModal from '@/components/auth-modals/otp-phone.vue';

const modalStore = useModalStore();

const { fetchPhoneNumbers } = useAuthService()
const phone_numbers = await fetchPhoneNumbers()

const props = defineProps({
    name: String,
    title: String,
});

const openValidationModal = () => {
  modalStore.openModal(OptPhoneModal);
}

const { value, errorMessage } = useField(() => props.name, yup
    .string()
    .matches(
        /^(\+40|0)(7[2-9]\d{7}|2\d{7}|3\d{7})$/,
        'Numărul de telefon trebuie să fie valid și să aibă 10 cifre'
    )
    .required('Numărul de telefon este obligatoriu'));
</script>