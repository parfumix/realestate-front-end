<template>
  <div>
    <NuxtLayout>
      <NuxtPage :page-key="handlePageKey" />
    </NuxtLayout>
  </div>
</template>

<script setup>
provideHeadlessUseId(() => useId())
const { createAnonymousUser, user } = useAuthService()

const handlePageKey = (route) => {
  return route?.meta?.key ?? route.name
}

onMounted(async() => {
  // the goal is to create once user anonymusly, then convert it if needed 
  await createAnonymousUser()
})
</script>
