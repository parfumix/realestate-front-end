<template>
    <div class="mt-2 p-3">
        <p class="text-sm text-gray-500">{{ item?.description }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },

});</script>