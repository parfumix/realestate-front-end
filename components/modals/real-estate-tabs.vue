<template>
  <nav class="flex space-x-4 h-[40px] bg-blue-500" aria-label="Tabs">
    <a v-for="tab in tabs" @click="() => handleSelect(tab)" :key="tab.name"
      class="cursor-pointer flex items-center"
      :aria-current="activeTab == tab.slug ? 'page' : undefined">
      <span v-html="tab.icon"></span>
      <span :class="[activeTab == tab.slug ? 'text-white underline underline-offset-3' : 'text-white  hover:text-gray-200', 'px-3 py-2 text-base font-medium pl-2']">{{ tab.name }}</span>
    </a>
  </nav>
</template>

<script setup>
  const props = defineProps({
    tabs: {
      type: Array
    },
    activeTab: {
      type: String
    }
  })

  const emit = defineEmits(['select'])

  const handleSelect = (tab) => {
    emit('select', tab)
  }
</script>