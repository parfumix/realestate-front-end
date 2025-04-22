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

if (typeof window !== 'undefined' && process.client) {
  window.addEventListener('storage', (event) => {
    if (event.key === 'auth-sync') {
      const auth = useAuthStore()
      auth.initializeFromToken(event.newValue)
    }
  })
}

const handlePageKey = (route) => {
  return route?.meta?.key ?? route.name
}
</script>
