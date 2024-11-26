<template>
    <ul role="list" class="divide-y divide-gray-100 overflow-auto">
        <li v-for="item in items" :key="item?.email" class="flex justify-between gap-x-6 py-2">
            <div class="flex min-w-0 gap-x-4">
                <div class="min-w-0 flex-auto">
                    <p class="text-sm/6 font-semibold text-gray-900">{{ item?.name }}</p>
                </div>
            </div>
            <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p class="text-sm/6 text-gray-900">~{{ (item?.dist_meters / 1000).toFixed(2) }} km distanţă</p>
            </div>
        </li>
    </ul>
</template>

<script setup>
    const props = defineProps({
        items: {
            type: Array
        }
    })
</script>