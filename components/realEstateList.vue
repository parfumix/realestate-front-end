<template>
  <div class="h-full" >
    <div v-if="items.length > 0" class="h-full">
      <RealEstateListItems class="flex flex-col justify-between h-full" :defaultView="defaultView" v-if="items.length > 0" :items="items" />
    </div>
      <EmptyResults v-else class="w-full h-full flex flex-col justify-center items-center" />
  </div>
</template>

<script setup>
const chatStore = useChatStore()
const { items } = storeToRefs(chatStore)

const props = defineProps({
  defaultView: {
    type: String
  }
})
</script>
