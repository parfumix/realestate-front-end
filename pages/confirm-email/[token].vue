<template>
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full p-6 bg-white rounded-xl shadow-md">
        <div v-if="status === 'loading'" class="text-center">
          <p>Confirming your email...</p>
        </div>
  
        <div v-else-if="status === 'success'" class="text-center text-green-600">
          <h2 class="text-xl font-semibold mb-2">✅ Email Confirmed</h2>
          <p>Your email has been successfully confirmed.</p>
        </div>
  
        <div v-else-if="status === 'error'" class="text-center text-red-600">
          <h2 class="text-xl font-semibold mb-2">❌ Confirmation Failed</h2>
          <p>{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const route = useRoute()
  const auth = useAuthStore()
  
  const status = ref('loading') // loading | success | error
  const errorMessage = ref('')
  
  const confirmEmail = async () => {
    const urlToken = route.params.token

    if (! urlToken) {
      status.value = 'error'
      errorMessage.value = 'Missing token in URL.'
      return
    }

    try {
      const { token } = await auth.confirmEmail(urlToken)
      auth.initializeFromToken(token)
      auth.notifyTabs(token)
      status.value = 'success'
    } catch (err) {
      console.error('Error confirming email:', err)
      status.value = 'error'
      errorMessage.value = err?.statusMessage || 'Email confirmation failed.'
    }
  }

  onMounted(() => {
    setTimeout(() => {
      confirmEmail()
    }, 500)
  })
  </script>
  
  <style scoped>
  body {
    background-color: #f8fafc;
  }
  </style>
  