<template>
    <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-sm flex justify-center">
        <!-- Form for sending OTP -->
        <form v-if="!isCodeSent" class="space-y-6 w-full" @submit.prevent="sendOtp">
          <p class="text-center">{{ modalProps.phoneNumber }}</p>
          <FormButton
            :class="['bg-blue-800 hover:bg-blue-700 w-full h-full text-lg']"
            text="Trimite OTP"
            type="submit"
            :disabled="isLoading"
          />
        </form>
  
        <!-- Form for validating OTP -->
        <form v-else class="space-y-6 w-full" @submit.prevent="validateOtp">
          <CreateOtp v-model="code" :length="4" />
          <FormButton
            type="submit"
            :class="[
              code?.length < 4 ? 'bg-blue-400 hover:bg-blue-500' : 'bg-blue-800 hover:bg-blue-700',
              'w-full h-full text-lg',
            ]"
            text="Valideaza"
            :disabled="code?.length < 4 || isLoading"
          />
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
    if (!modalProps.value.phoneNumber) {
      notify({
        title: 'Eroare!',
        text: 'Numărul de telefon este obligatoriu.',
        type: 'error',
      });
      return;
    }
  
    try {
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
    if (!code.value || code.value.length < 4) {
      notify({
        title: 'Eroare!',
        text: 'Codul OTP este obligatoriu.',
        type: 'error',
      });
      return;
    }
  
    try {
      isLoading.value = true;
      await validateCode(modalProps.value.phoneNumber, code.value);
  
      handleSuccess('OTP trimis cu succes!');

      notify({
        title: 'Succes!',
        text: 'Codul OTP a fost verificat cu succes. Mulțumim!',
      });
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
  