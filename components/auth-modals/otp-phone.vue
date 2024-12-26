<template>
    <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-sm space-y-10">
            <form class="space-y-6" action="#" method="POST">
                <div class="relative -space-y-px rounded-md shadow-sm">
                    123
                </div>


                <div>
                    <button type="submit" :disabled="isLoading"
                        class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Creează
                        un cont</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modals';
const modalStore = useModalStore();
const { startVerification, validateCode } = useVerificationService()

const { notify } = useNotification();

const isLoading = ref(false)

const phoneNumber = ref(null)
const code = ref(null)

const sendOtp = async () => {
    try {
        isLoading.value = true

        await startVerification(phoneNumber.value)

        notify({
            title: "Confirmă adresa de e-mail!",
            text: "Te rugăm să îți verifici e-mailul și să confirmi adresa înainte de a te putea autentifica și accesa contul. Mulțumim!",
        });

    } catch (err) {
        notify({
            title: "..!",
            text: err?.message || "A apărut o eroare!",
            type: 'error'
        });
    } finally {
        isLoading.value = false
    }
}

const validateOtp = async (code) => {
    try {
        isLoading.value = true

        await validateCode(phoneNumber.value, code)

        notify({
            title: "Confirmă adresa de e-mail!",
            text: "Te rugăm să îți verifici e-mailul și să confirmi adresa înainte de a te putea autentifica și accesa contul. Mulțumim!",
        });

        modalStore.closeModal()
    } catch (err) {
        notify({
            title: "..!",
            text: err?.message || "A apărut o eroare!",
            type: 'error'
        });
    } finally {
        isLoading.value = false
    }
}

</script>