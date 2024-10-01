<template>
    <div>
      <p>Signing in...</p>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const supabase = useSupabaseClient()
  const router = useRouter()
  
  onMounted(async () => {
    const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
    if (error) {
      console.error('Error retrieving session:', error.message)
    } else {
      router.push('/')
    }
  })
  </script>
  