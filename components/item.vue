<template>
    <div class="flex fw-full h-full items-start justify-start px-2 pt-2 pb-1">
        <div class="flex-1 items-center justify-center">
          <p class="text-xs font-medium text-gray-900 pb-1 px-1 hover:underline cursor-pointer h-[55px]" :title="item?.title">{{ (item?.title || '').substring(36, item?.title) + '…' }}</p>
          <p class="text-sm font-bold text-gray-900">{{ $currencyFormat(item.price, 'fr-FR', 'EUR') }}</p>
          <p class="text-xs font-normal text-gray-900" v-if="item.area && item.price">{{ parseFloat(item?.price / parseFloat(new String(item?.area).match(/\d+(\.\d+)?/))).toFixed(2) }} EUR<span class="text-gray-800"> / m2</span></p>
        </div>
        <img class="h-[5.5rem] w-[5.5rem] flex-shrink-0 rounded-xl cursor-pointer" :src="item?.images?.[0]" alt="" />
      </div>
</template>

<script setup>
const props = defineProps({
    item: Object
})
</script>