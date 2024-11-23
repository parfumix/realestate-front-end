<template>
    <div>
        <RealEstateList :defaultView="defaultView" />
    </div>
</template>

<script setup>
let defaultView = ref(
  localStorage.getItem('defaultView') ?? 'list'
)
</script>