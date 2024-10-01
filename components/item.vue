<template>
    <div class="flex w-full h-full items-center justify-between space-x-6 p-6">
        <div class="flex-1 truncate">
          <div class="flex items-center space-x-3">
            <h3 class="truncate text-sm font-medium text-gray-900">{{ item?.title }}</h3>
            <span class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">${{ item?.price }}</span>
          </div>
          <p class="mt-1 truncate text-sm text-gray-500">{{ item?.description }}</p>
        </div>
        <img class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" :src="item?.imageUrl" alt="" />
      </div>
</template>

<script setup>
const props = defineProps({
    item: Object
})
</script>