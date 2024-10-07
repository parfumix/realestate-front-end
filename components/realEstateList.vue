<template>
  <div class="h-full">
    <div class="flex flex-col justify-between h-full">
      <RealEstateListItems :items="items" />
    </div>
</div>
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
