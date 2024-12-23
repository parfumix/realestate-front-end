<template>
    <div class="flex-1 scroll-my-12 relative">
        <div :class="['overflow-hidden shadow-sm rounded-lg ring-1 ring-inset',  
            error ? 'ring-red-200 focus-within:ring-red-500' : 'ring-gray-200 focus-within:ring-gray-400',]">
            <label :for="id">
                <span v-if="required" class="text-red-600 py-2 px-1 inline-block">*</span> {{ label }}
            </label>

            <textarea :id="id" :rows="rows" :placeholder="placeholder" :value="model" :maxlength="maxLength" :class="[
                'block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 sm:text-sm sm:leading-6 focus:outline-none focus:outline-0 focus:ring-0',
                error ? ' placeholder:text-red-300' : 'placeholder:text-gray-400',
                borderColor,
                textColor,
                focusColor
            ]" @input="e => handleInput(e.target.value)" />

            <!-- Spacer element to match the height of the toolbar -->
            <div class="py-2 " aria-hidden="true">
                <div class="py-px">
                    <div class="h-9"></div>
                </div>
            </div>
        </div>

        <div class="absolute border-t border-gray-400 inset-x-0 bottom-0 flex justify-between items-center py-2 px-4">
            <slot name="left-actions"></slot>
            <slot name="right-actions"></slot>
        </div>
    </div>

    <div class="mt-2">
        <div :class="`flex  ${error ? 'justify-between' : 'justify-end'}`">
            <p v-if="error" v-text="error" :id="`${id}-error`" class="text-sm text-red-600" />
            <div class="text-sm text-gray-500 self-end">
                {{ characterCount }} / {{ maxLength }}
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    required: {
        type: Boolean,
        required: false,
        default: false
    },
    label: {
        type: String,
        default: 'Introduceți textul',
    },
    rows: {
        type: Number,
        default: 4,
    },
    placeholder: {
        type: String,
        default: 'Tastați aici...',
    },
    borderColor: {
        type: String,
        default: 'ring-gray-300',
    },
    textColor: {
        type: String,
        default: 'text-gray-900',
    },
    focusColor: {
        type: String,
        default: '',
    },
    maxLength: {
        type: Number,
        default: 200,
    },
    error: {
        type: String,
        default: ''
    }
});

const model = defineModel()
const characterCount = computed(() => model.value?.length || 0)

const handleInput = value => {
    model.value = value
}
</script>