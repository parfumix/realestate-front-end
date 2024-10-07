<template>
    <ul class="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-4 no-scrollbar overflow-y-auto pb-2">
        <RealEstateListItem v-for="item in items" :item="item" :key="item.id" class="relative" />
    </ul>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array
    }
})
</script>
