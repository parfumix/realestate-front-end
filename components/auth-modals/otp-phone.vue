<template>
    <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-sm flex justify-center">
            <!-- Form for sending OTP -->
            <form v-if="!isCodeSent" class="space-y-6 w-full" @submit.prevent="sendOtp">
                <p class="text-center text-2xl text-gray-900 font-bold">Confirmarea numărului</p>
                <p class="text-center text-lg font-bold text-gray-700">{{ modalProps.phoneNumber }}</p>

                <FormButton :class="[isLoading ? 'bg-blue-400 hover:bg-blue-500' : 'bg-blue-800 hover:bg-blue-700', 'w-full h-[35px] text-lg flex items-center justify-center']" type="submit" :disabled="isLoading">
                    Obţine cod
                    <Loader v-if="isLoading" class="animate-spin ml-2" size="16" />
                </FormButton>
                <FormAlert message="La numărul respectiv va veni un cod de confirmare." />
            </form>

            <!-- Form for validating OTP -->
            <form v-else class="space-y-6 w-full" @submit.prevent="validateOtp">
                <p class="text-sm text-gray-700 text-center">La numărul indicat în decurs de cinci minute va veni un mesaj-SMS cu codul, necesar a fi introdus în cîmpul de mai jos.</p>
                <CreateOtp class="flex justify-center" v-model="code" :length="CODE_LENGTH" />

                <!-- Try again in 30 seconds -->
                <div class="text-center flex justify-center mt-2">
                    <a v-if="resendCounter === 0" @click="sendOtp" class="text-blue-600 text-sm underline decoration-dotted cursor-pointer">
                        Trimite din nou
                    </a>
                    <p v-else class="text-gray-700">
                        <FormAlert :message="`Poți trimite din nou un SMS în ${resendCounter} secunde.`" />
                    </p>
                </div>
                    
                <FormButton type="submit" :class="[(code?.length < CODE_LENGTH || isLoading) ? 'bg-blue-400 hover:bg-blue-500' : 'bg-blue-800 hover:bg-blue-700', ' w-full h-[35px] text-lg flex justify-center items-center']" :disabled="code?.length < CODE_LENGTH || isLoading">
                    Validează
                    <Loader v-if="isLoading" class="animate-spin ml-2" size="16" />
                </FormButton>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modals';
import { Loader } from "lucide-vue-next"

const modalStore = useModalStore();
const { startVerification, validateCode } = useVerificationService();
const { notify } = useNotification();
const { modalProps } = storeToRefs(modalStore);

const CODE_LENGTH = 4
const RESEND_INTERVAL = 30; // 30 seconds
const MAX_RETRIES = 3; // Maximum number of retries

const isLoading = ref(false);
const isCodeSent = ref(false);
const code = ref('');

let retries = 0
const resendCounter = ref(0);
let resendInterval = null;

// Common success handler
const handleSuccess = (message) => {
    modalStore.success({ message });
}

// Start the resend countdown
const startResendCountdown = () => {
  resendCounter.value = RESEND_INTERVAL;
  resendInterval = setInterval(() => {
    if (resendCounter.value > 0) {
      resendCounter.value--;
    } else {
      clearInterval(resendInterval);
    }
  }, 1000);
};

// Handle OTP sending
const sendOtp = async () => {
    try {
        if (! modalProps.value.phoneNumber) {
            throw new Error('Numărul de telefon este obligatoriu')
        }

        isLoading.value = true;
      
        if(retries >= MAX_RETRIES) {
            throw new Error('You have exceeded the maximum number of OTP requests. Please try again later.')
        }       
        
        await startVerification(modalProps.value.phoneNumber)
        isCodeSent.value = true

        startResendCountdown();
        retries++

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
}

// Clear the interval when the component is destroyed
onUnmounted(() => {
  if (resendInterval) {
    clearInterval(resendInterval);
  }
});
</script>