<template>
    <div>
      <h1>Login</h1>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="signInWithEmail">Sign In with Email</button>
      <button @click="signInWithOAuth">Sign In with GitHub</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const supabase = useSupabaseClient()
  const router = useRouter()
  
  const signInWithEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) {
      console.error('Error signing in:', error.message)
    } else {
      router.push('/')
    }
  }
  
  const signInWithOAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000/confirm',
      },
    })
    if (error) {
      console.error('Error during OAuth sign-in:', error.message)
    }
  }
  </script>
  