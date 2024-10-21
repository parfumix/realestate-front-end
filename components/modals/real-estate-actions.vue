<template>
    <div class="flex justify-between items-center py-2 mr-4">
        <div>
            <p class="text-sm text-gray-700">Publicat pe: {{ formattedDate }}</p>
        </div>
        <div class="flex items-center justify-end space-x-4">
            <div v-for="(action, index) in actions" :key="index" class="cursor-pointer">
                <span @click="action.handler" v-html="action.icon"></span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { format } from 'date-fns'
import { ro } from 'date-fns/locale'

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
})

const formattedDate = computed(() => {
    return format(new Date(props.item.created_at), "d MMMM yyyy", { locale: ro })
})

const actions = ref([{
    handler: () => {
    },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:text-gray-700"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>',
}, {
    handler: () => {
    },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>'
}])
</script>