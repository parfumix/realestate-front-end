<template>
    <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-sm space-y-10">
        <form @submit.prevent="signInWithEmail" class="space-y-6" action="#" method="POST">
          <div class="relative -space-y-px rounded-md shadow-sm">
            <div class="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input id="email-address" v-model="email" name="email" type="email" autocomplete="email" required=""
                class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Email address" />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" name="password" v-model="password" type="password" autocomplete="current-password"
                required=""
                class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Password" />
            </div>
          </div>
  
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
              <label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-900">Remember me</label>
            </div>
  
            <div class="text-sm leading-6">
              <a href="#" class="font-semibold text-blue-600 hover:text-blue-500">Forgot password?</a>
            </div>
          </div>
  
          <div>
            <button type="submit"
              class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Sign
              in</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  const email = ref('')
  const password = ref('')
  const modalStore = useModalStore();
  
  const { loginUser } = useAuthService()
  
  const signInWithEmail = async () => {
    try {
      await loginUser(email.value, password.value)
      modalStore.closeModal()
    } catch (err) {
      console.error('Error signing in:', err.message)
    }
  }
  </script>