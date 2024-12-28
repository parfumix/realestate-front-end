<template>
    <CreateElementsTotalArea :title="fieldsMeta['area'].long" name="area" />
</template>

<script setup>
    defineProps({
        fieldsMeta: {
            type: Object,
            required: true
        }
    })
</script>