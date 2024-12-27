<template>
    <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-sm flex justify-center">
            <form class="space-y-6 w-full" v-if="isCodeSent" @submit.prevent>
                <p class="text-center">{{ modalProps.phoneNumber }}</p>
                <FormButton v-if="!isCodeSent" :class="['bg-blue-800 hover:bg-blue-700 w-full h-full text-lg']" text="Trimite OTP" @onClick="sendOtp" />
            </form>

            <form class="space-y-6" v-if="!isCodeSent" @submit.prevent>
                <CreateOtp v-model="code" :length="4" />
                <FormButton :class="[code?.length < 4 ? 'bg-blue-400 hover:bg-blue-500' : 'bg-blue-800 hover:bg-blue-700', ' w-full h-full text-lg']" text="Valideaza" :disabled="code?.length<4" @onClick="validateOtp" />
            </form>
        </div>
    </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modals';
const modalStore = useModalStore();
const { startVerification, validateCode } = useVerificationService();

const { notify } = useNotification();
const { modalProps } = storeToRefs(modalStore)

const isLoading = ref(false);
const isCodeSent = ref(false);
const code = ref('');

// Handle success action
const handleSuccess = () => {
    modalStore?.success({ message: 'Action succeeded!' });
};

// Handle failure action
const handleFailure = () => {
    modalStore?.fail({ message: 'Action failed!' });
};

const sendOtp = async () => {
    try {
        isLoading.value = true;

        if (! modalProps.value.phoneNumber) {
            throw new Error("Numărul de telefon este obligatoriu.");
        }

        await startVerification(modalProps.value.phoneNumber);

        isCodeSent.value = true
        handleSuccess()

        notify({
            title: "OTP Trimite!",
            text: "Codul OTP a fost trimis pe numărul de telefon specificat.",
        });

    } catch (err) {
        notify({
            title: "Eroare!",
            text: err?.message || "A apărut o eroare!",
            type: 'error'
        });

        handleFailure()
    } finally {
        isLoading.value = false;
    }
};

const validateOtp = async () => {
    try {
        isLoading.value = true;

        if (!code.value || code.value?.length < 4) {
            throw new Error("Codul OTP este obligatoriu.");
        }

        await validateCode(modalProps.value.phoneNumber, code.value);

        notify({
            title: "Succes!",
            text: "Codul OTP a fost verificat cu succes. Mulțumim!",
        });

        modalStore.closeModal();
    } catch (err) {
        notify({
            title: "Eroare!",
            text: err?.message || "Codul OTP este incorect sau a expirat!",
            type: 'error'
        });
    } finally {
        isLoading.value = false;
    }
}
</script>
