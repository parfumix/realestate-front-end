<template>
    <div class="overflow-hidden">
        <ol class=" h-full space-y-3">
            <li v-for="(field, index) in fields" :key="field.label" class="relative flex-1" :class="{
                'after:content-[\'\'] after:w-0.5 after:h-full after:inline-block after:absolute after:-bottom-6 after:left-[11px]':
                index !== fields.length - 1,
                'after:bg-green-600': field.status === 'filled',
                'after:bg-gray-200': field.status !== 'filled',
            }">
                <a class="flex items-center font-medium w-full">
                    <span :title="field.status === 'errored' ? field.error : null" :class="{
                        'w-6 h-6 flex justify-center items-center mr-3 text-sm rounded-full border': true,
                        'bg-green-600 text-white border-transparent': field.status === 'filled',
                        'bg-gray-50 text-gray-500 border-gray-300': field.status === 'empty',
                        'bg-red-50 text-red-600 border-red-600': field.status === 'errored',
                    }">
                        <Check :size="14" v-if="field.status === 'filled'" />
                        <span class="text-xs" v-else>{{ index + 1 }}</span>
                    </span>
                    <div class="block">
                        <h4 @click="() => scrollToElement(field.id)" :title="field.fullLabel" :class="{
                            'text-xs cursor-pointer hover:underline': true,
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

const props = defineProps({
    fields: {
        type: Array,
        required: true,
        default: () => [],
    },
})

const scrollToElement = (target, marginTop = 30) => {
    const element = document.getElementById(target);

    if (element) {
        const collapsibleParent = element.closest('.collapsible');

        // Check if the parent has data-opened set to false
        if (collapsibleParent && collapsibleParent.dataset.opened === "false") {
            const toggleButton = collapsibleParent.querySelector('button');
            if (toggleButton) {
                toggleButton.click();
            }
        }

        // Allow time for the collapsible to expand before scrolling
        setTimeout(() => {
            const elementRect = element.getBoundingClientRect();

            // Check if the element is already in the viewport
            const isInViewport = 
                elementRect.top >= marginTop && 
                elementRect.bottom <= window.innerHeight;

            if (isInViewport) {
                element.focus();
            } else {
                element.scrollIntoView({ behavior: 'smooth' });

                setTimeout(() => {
                    element.focus();
                }, 350); 
            }
        }, 300)
    }
}
</script>
