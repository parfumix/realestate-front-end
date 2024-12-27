<template>
    <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-sm flex justify-center">
            <!-- Form for sending OTP -->
            <form v-if="!isCodeSent" class="space-y-6 w-full" @submit.prevent="sendOtp">
                <p class="text-center text-2xl text-gray-900 font-bold">Confirmarea numărului</p>
                <p class="text-center text-lg font-bold text-gray-700">{{ modalProps.phoneNumber }}</p>

                <FormButton :class="['bg-blue-800 hover:bg-blue-700 w-full h-[35px] text-lg']" text="Obţine cod" type="submit" :disabled="isLoading" />
                <FormAlert message="La numărul respectiv va veni un cod de confirmare." />
            </form>

            <!-- Form for validating OTP -->
            <form v-else class="space-y-6 w-full" @submit.prevent="validateOtp">
                <p class="text-sm text-gray-700 text-center">La numărul indicat în decurs de cinci minute va veni un mesaj-SMS cu codul, necesar a fi introdus în cîmpul de mai jos.</p>
                <CreateOtp class="flex justify-center" v-model="code" :length="CODE_LENGTH" />
                <FormButton type="submit" :class="[
                    code?.length < CODE_LENGTH ? 'bg-blue-400 hover:bg-blue-500' : 'bg-blue-800 hover:bg-blue-700',
                    ' w-full h-[35px] text-lg',
                ]" text="Valideaza" :disabled="code?.length < CODE_LENGTH || isLoading" />
            </form>
        </div>
    </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modals';

const modalStore = useModalStore();
const { startVerification, validateCode } = useVerificationService();
const { notify } = useNotification();
const { modalProps } = storeToRefs(modalStore);

const CODE_LENGTH = 4

const isLoading = ref(false);
const isCodeSent = ref(false);
const code = ref('');

// Common success handler
const handleSuccess = (message) => {
    modalStore.success({ message });
};

// Common failure handler
const handleFailure = (message) => {
    modalStore.fail({ message });
};

// Handle OTP sending
const sendOtp = async () => {
    try {
        if (!modalProps.value.phoneNumber) {
            throw new Error('Numărul de telefon este obligatoriu')
        }

        isLoading.value = true;
        await startVerification(modalProps.value.phoneNumber);

        isCodeSent.value = true

        notify({
            title: 'Succes!',
            text: 'Codul OTP a fost trimis pe numărul de telefon specificat.',
        });
    } catch (err) {
        notify({
            title: 'Eroare!',
            text: err?.message || 'A apărut o eroare!',
            type: 'error',
        });
        handleFailure('Eroare la trimiterea OTP.');
    } finally {
        isLoading.value = false;
    }
};

// Handle OTP validation
const validateOtp = async () => {
    try {
        if (!code.value || code.value.length < CODE_LENGTH) {
            throw new Error('Codul OTP este obligatoriu')
        }

        isLoading.value = true;
        await validateCode(modalProps.value.phoneNumber, code.value);

        notify({
            title: 'Succes!',
            text: 'Codul OTP a fost verificat cu succes. Mulțumim!',
        });

        handleSuccess('OTP trimis cu succes!');
    } catch (err) {
        notify({
            title: 'Eroare!',
            text: err?.message || 'Codul OTP este incorect sau a expirat!',
            type: 'error',
        });
    } finally {
        isLoading.value = false;
    }
};
</script>