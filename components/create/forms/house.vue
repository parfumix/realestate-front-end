<template>
    <CreateElementsTotalArea :title="fieldsMeta['totalArea'].long" name="totalArea" />
    <CreateElementsSurface :title="fieldsMeta['surface'].long" name="surface" />
    <CreateElementsLocation :title="fieldsMeta['location'].long" :description="fieldsMeta['location'].description" name="location" />
</template>

<script setup>
    defineProps({
        fieldsMeta: {
            type: Object,
            required: true
        }
    })
</script>