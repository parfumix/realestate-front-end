<template>
  <div class="h-full">
    <NuxtLayout>
      <NuxtPage :page-key="handlePageKey" />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  htmlAttrs: {
    class: 'h-full bg-white'
  },
  bodyAttrs: {
    class: 'h-full'
  }
})

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
