<template>
  <div class="h-full" v-if="items.length > 0">
    <div class="flex flex-col justify-between h-full">
      <RealEstateListItems v-if="items.length > 0" :items="items" />
    </div>
  </div>
  <EmptyResults v-else class="w-full h-full flex flex-col justify-center items-center" />
</template>

<script setup>
const chatStore = useChatStore()
const { items } = storeToRefs(chatStore)
</script>
