<template>
    <div class="mt-2 p-3">
        <h2 class="text-lg text-gray-700 font-bold">Descriere</h2>
        <p class="text-sm text-gray-500">{{ item?.meta?.description }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },

})
</script>