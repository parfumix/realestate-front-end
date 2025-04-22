<template>
  <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-sm space-y-10">
      <form @submit.prevent="signUp" class="space-y-6" action="#" method="POST">
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
            <a @click="modalStore.openModal(SignInModal)"
              class="cursor-pointer font-semibold text-blue-600 hover:text-blue-500">Intră în Cont</a>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isLoading" class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Creează un cont</button>
        </div>

        <AuthModalsConfirmationWarning v-if="!authStore.emailVerified && authStore.emailPending" />
      </form>
    </div>
  </div>
</template>

<script setup>
import SignInModal from '@/components/auth-modals/sing-in.vue';

const { notify } = useNotification();
const authStore = useAuthStore();
const modalStore = useModalStore();

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const signUp = async () => {
  try {
    isLoading.value = true

    const { token } = await authStore.register(email.value ,password.value)
    await authStore.initializeFromToken(token)
    useState('auth-token', () => token ?? null)
    
    notify({
      title: "Confirmă adresa de e-mail!",
      text: "Te rugăm să îți verifici e-mailul și să confirmi adresa înainte de a te putea autentifica și accesa contul. Mulțumim!",
    });

    modalStore.closeModal()
  } catch (err) {
    notify({
      title: "Eroare la înregistrare!",
      text: err?.message || "A apărut o eroare!",
      type: 'error'
    });
  } finally {
    isLoading.value = false
  }
}
</script>
