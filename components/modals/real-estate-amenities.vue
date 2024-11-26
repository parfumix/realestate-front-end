<template>
    <div class="mx-6 py-3 h-[300px] overflow-y-auto">
        <ul v-if="items.length" role="list" class="divide-y divide-gray-100 h-full no-scrollbar">
            <li v-for="item in items" :key="item?.email" class="flex justify-between gap-x-6 py-2">
                <div class="flex items-center min-w-0 gap-x-4">
                    <div class="min-w-0 flex-auto">
                        <p class="text-sm/6 font-semibold text-gray-900">{{ item?.name }}</p>
                    </div>
                </div>
                <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p class="text-sm/6 text-gray-900">
                        ~{{ (item?.dist_meters / 1000).toFixed(2) }} km distanţă
                    </p>
                    <p class="text-sm/6 text-gray-900">
                        Walking: ~{{ calculateTravelTime(item?.dist_meters) }} minutes
                    </p>
                </div>
            </li>
        </ul>

        <div v-if="!items.length" class="text-gray-500">
            No amenities found in this area.
        </div>
    </div>
</template>

<script setup>

import { calculateTravelTime } from '../utils'

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
});
</script>