<template>
    <div>
        <h3 class="mb-2 text-sm font-semibold leading-6 text-gray-900">{{ title }}</h3>
        <ul class="grid w-full gap-3 md:grid-cols-4">
            <li v-for="option in options" :key="option.value">
                <input :id="option.value" type="radio" :name="name" :value="option.value" class="hidden peer" :checked="option.value === radioModel" @change="() => handleChange(option.value)" required />
                <label :for="option.value"
                    class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                    <div class="block">
                        <div class="w-full text-lg font-semibold">{{ option.label }}</div>
                        <div class="w-full">{{ option.title }}</div>
                    </div>
                    <div v-html="option.svg"></div>
                </label>
            </li>
        </ul>

        <p v-if="error" :id="`${name}-error`" class="mt-2 text-sm text-red-600">
            {{ error }}
        </p>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: 'Choose an option',
    },
    name: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        required: true
    },
    error: {
        type: String,
        default: ''
    }
})

const radioModel = defineModel()
const handleChange = (value) => {
    radioModel.value = value
}
</script>