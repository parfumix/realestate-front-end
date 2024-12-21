<template>
    <div class="bg-gray-50 border border-gray-200 text-sm text-gray-600 rounded-lg px-4 py-3" role="alert" tabindex="-1" :aria-labelledby="alertLabelId">
        <div class="flex items-center">
            <div class="shrink-0 items-center">
                <slot name="icon">
                    <Info size="14" />
                </slot>
            </div>
            <div class="flex-1 md:flex md:justify-between ms-2">
                <p :id="alertLabelId" class="text-sm" v-html="message" />
                <p class="text-sm mt-3 md:mt-0 md:ms-6" v-if="linkText && linkUrl">
                    <a :href="linkUrl"
                        class="text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 font-medium whitespace-nowrap dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400">
                        {{ linkText }}
                    </a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Info } from 'lucide-vue-next'

defineProps({
    message: {
        type: String,
        required: true,
    },
    linkText: {
        type: String,
        default: '',
    },
    linkUrl: {
        type: String,
        default: '',
    },
    alertLabelId: {
        type: String,
        default: 'alert-label',
    },
});
</script>