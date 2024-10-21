<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
provideHeadlessUseId(() => useId())
const { createAnonymousUser, user } = useAuthService()

onMounted(async() => {
  // the goal is to create once user anonymusly, then convert it if needed 
  await createAnonymousUser()
})
</script>
