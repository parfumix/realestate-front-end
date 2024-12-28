<template>
    <CreateElementsTotalArea :title="fieldsMeta['area'].long" name="area" />
    <CreateElementsFloor :title="fieldsMeta['floor'].long" name="floor" />
</template>

<script setup>
    defineProps({
        fieldsMeta: {
            type: Object,
            required: true
        }
    })
</script>