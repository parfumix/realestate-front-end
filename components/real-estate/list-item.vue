<template>
    <li class="shadow rounded-md ">
        <div class="group aspect-h-6 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <img :src="item.images?.[0]" :alt="item.description" class="pointer-events-none object-cover group-hover:opacity-75" />
        </div>
        <div class="px-3 py-2 flex flex-col justify-start">
            <p class="text-sm font-extrabold font-medium text-gray-900 leading-5 pb-2 hover:underline cursor-pointer" :title="item?.title">{{ (item?.title || '').substring(36, item?.title) + '…' }}</p>

            <p class="text-sm font-bold text-gray-900">{{ $currencyFormat(item.price, 'fr-FR', 'EUR') }}</p>
            <p class="text-[11px] font-normal text-gray-900" v-if="item.area && item.price">{{ parseFloat(item?.price / parseFloat(new String(item?.area).match(/\d+(\.\d+)?/))).toFixed(0) }} EUR<span class="text-gray-800"> / m2</span></p>
        </div>
    </li>
</template>

<script setup>
const props = defineProps({
    item: {
        type: Object
    }
})
</script>
