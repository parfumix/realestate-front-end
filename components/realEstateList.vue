<template>
  <div class="h-full" v-if="items.length > 0">
    <div class="flex flex-col justify-between h-full">
      <RealEstateListItems v-if="items.length > 0" :items="items" />
    </div>
  </div>
  <EmptyResults v-else class="w-full h-full flex flex-col justify-center items-center" />
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>
