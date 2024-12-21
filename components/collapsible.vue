<template>
    <div class="rounded-lg mb-4 overflow-hidden" :data-opened="isOpen">
        <button class="w-full text-left px-4 py-2 transition flex justify-between items-center" @click.stop.prevent="isOpen = !isOpen">
            <span class="text-base text-gray-800">{{ title }}</span>
            <span>
                <ChevronDown :size="14" v-if="isOpen" />
                <ChevronUp :size="14" v-else />
            </span>
        </button>
        <div v-show="isOpen" class="px-4 py-2 bg-white">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ChevronDown, ChevronUp } from 'lucide-vue-next';

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    isOpened: {
        type: Boolean,
        default: false
    }
});

const isOpen = ref(props.isOpened);
</script>