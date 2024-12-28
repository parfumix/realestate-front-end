<template>
    <CreateElementsRoomCount :title="fieldsMeta['roomCount'].long" name="roomCount" />
    <CreateElementsTotalArea :title="fieldsMeta['area'].long" name="area" />
    <CreateElementsFloor :title="fieldsMeta['floor'].long" name="floor" />
    <CreateElementsBalcony :title="fieldsMeta['balcony'].long" name="balcony" />
    <CreateElementsParking :title="fieldsMeta['parking'].long" name="parking" />
    <CreateElementsApartmentCondition :title="fieldsMeta['apartmentCondition'].long" name="apartmentCondition" />
</template>

<script setup>
    defineProps({
        fieldsMeta: {
            type: Object,
            required: true
        }
    })
</script>