<template>
  <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-sm space-y-10">
      <form @submit.prevent="signInWithEmail" class="space-y-6" action="#" method="POST">
        <div class="relative -space-y-px rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
          <div>
            <label for="email-address" class="sr-only">Adresa de email</label>
            <input id="email-address" v-model="email" name="email" type="email" autocomplete="email" required=""
              class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Adresa de email" />
          </div>
          <div>
            <label for="password" class="sr-only">Parola</label>
            <input id="password" name="password" v-model="password" type="password" autocomplete="current-password"
              required=""
              class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Parola" />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm leading-6">
            <a @click="modalStore.openModal(RegisterModal)"
              class="cursor-pointer font-semibold text-blue-600 hover:text-blue-500">Creează un cont</a>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isLoading" class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Intră în Cont</button>
        </div>

        <AuthModalsConfirmationWarning v-if="isUserPendingConfirmation()" />
      </form>
    </div>
  </div>
</template>

<script setup>
import RegisterModal from '@/components/auth-modals/register.vue';
import { useModalStore } from '@/stores/modals';

// https://preline.co/examples/forms-authentication.html
const email = ref('')
const password = ref('')
const modalStore = useModalStore();

const { loginUser } = useAuthService()
const { notify } = useNotification();
const isLoading = ref(false)
const { isUserPendingConfirmation } = useAuthService()

const signInWithEmail = async () => {
  try {
    isLoading.value = true

    await loginUser(email.value, password.value)

    notify({
      title: "Autentificare reușită!",
      text: "Acum poți accesa toate funcționalitățile contului tău!",
    });

    modalStore.closeModal()
  } catch (err) {
    notify({
      title: "Eroare la autentificare!",
      text: err?.message || "A apărut o eroare!",
      type: 'error',
    })
  } finally {
    isLoading.value = false
  }
}
</script>