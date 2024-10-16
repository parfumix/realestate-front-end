<template>
  <nav class="flex space-x-4" aria-label="Tabs">
    <a v-for="tab in tabs" @click="() => handleSelect(tab)" :key="tab.name" :href="tab.href"
      :class="[tab.current ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700', 'rounded-md px-3 py-2 text-sm font-medium']"
      :aria-current="tab.current ? 'page' : undefined">{{ tab.name }}</a>
  </nav>
</template>

<script setup>
  const props = defineProps({
    tabs: {
      type: Array
    }
  })

  const emit = defineEmits(['select'])

  const handleSelect = (tab) => {
    emit('select', tab)
  }
</script>