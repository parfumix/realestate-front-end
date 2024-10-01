<template>
    <div>
      <h1>Register</h1>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="signUp">Sign Up</button>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  
  const supabase = useSupabaseClient()
  const router = useRouter()
  
  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })
  
    if (error) {
      errorMessage.value = error.message
      console.error('Error signing up:', error.message)
    } else {
      // Redirect to a confirmation page or the home page after successful signup
      router.push('/')
    }
  }
  </script>
  