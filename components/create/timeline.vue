<template>
    <div class="overflow-hidden">
        <ol class=" h-full space-y-3">
            <li v-for="(field, index) in fields" :key="field.label" class="relative flex-1" :class="{
                'after:content-[\'\'] after:w-0.5 after:h-full after:inline-block after:absolute after:-bottom-12 after:left-[11px]':
                    index !== fields.length - 1,
                'after:bg-green-600': field.status === 'filled',
                'after:bg-green-300': field.status !== 'filled',
            }">
                <a class="flex items-center font-medium w-full">
                    <span :title="field.status === 'errored' ? field.error : null" :class="{
                        'w-6 h-6 flex justify-center items-center mr-3 text-sm rounded-full border-2': true,
                        'bg-green-600 text-white border-transparent': field.status === 'filled',
                        'bg-green-50 text-green-600 border-green-600': field.status === 'empty',
                        'bg-red-50 text-red-600 border-red-600': field.status === 'errored',
                    }">
                        <Check :size="14" v-if="field.status === 'filled'" />
                        <span v-else>{{ index + 1 }}</span>
                    </span>
                    <div class="block">
                        <h4 :title="field.fullLabel" :class="{
                            'text-xs': true,
                            'text-green-600': field.status === 'filled',
                            'text-red-600': field.status === 'errored',
                            'text-gray-800': field.status === 'empty',
                        }">
                            {{ field.label }}
                        </h4>
                    </div>
                </a>
            </li>
        </ol>
    </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next';

defineProps({
    fields: {
        type: Array,
        required: true,
        default: () => [],
    },
});
</script>