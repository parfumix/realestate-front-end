<template>
    <div class="flex space-x-2">
      <button class="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm" @click="() => handleSwitchView(itemsStore.TYPE_MAP_ITEMS)">Map Mode</button>
      <button class="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm" @click="() => handleSwitchView(itemsStore.TYPE_LIST_ITEMS)">List Mode</button>
      <button class="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm" @click="() => handleSwitchView(itemsStore.TYPE_LIST_HYBRID)">Hybrid Mode</button>
    </div>
</template>

<script setup>
import { useItemsStore } from '@/stores/itemsStore';
const itemsStore = useItemsStore()

const emit = defineEmits(['change'])

const handleSwitchView = (viewMode) => {
  emit('change', viewMode)
}
</script>