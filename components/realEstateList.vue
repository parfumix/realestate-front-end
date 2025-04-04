<template>
  <div class="h-full" >
    <div v-if="items.length && isItemsLoaded" class="h-full">
      <RealEstateListItems class="flex flex-col justify-between h-full" :defaultView="defaultView" :items="items" />
    </div>
    <EmptyResults v-else class="w-full h-full flex flex-col justify-center items-center" />
  </div>
</template>

<script setup>
const itemsStore = useItemsStore()
const { items, isItemsLoaded } = storeToRefs(itemsStore)

const props = defineProps({
  defaultView: {
    type: String
  }
})
</script>
