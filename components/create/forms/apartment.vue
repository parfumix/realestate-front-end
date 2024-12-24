<template>
    <CreateElementsRoomCount :title="fieldsMeta['roomCount'].long" name="roomCount" />
    <CreateElementsTotalArea :title="fieldsMeta['totalArea'].long" name="totalArea" />
    <CreateElementsSurface :title="fieldsMeta['surface'].long" name="surface" />
    <CreateElementsFloor :title="fieldsMeta['floor'].long" name="floor" />
    <CreateElementsBalcony :title="fieldsMeta['balcony'].long" name="balcony" />
    <CreateElementsParking :title="fieldsMeta['parking'].long" name="parking" />
    <CreateElementsApartmentCondition :title="fieldsMeta['apartmentCondition'].long" name="apartmentCondition" />
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