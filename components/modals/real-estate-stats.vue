<template>
  <div class="bg-gray-100 p-4 rounded-lg">
    <div class="text-gray-700">
      <p><strong>Price:</strong> {{ item.price }} EUR</p>
      <p><strong>Area:</strong> {{ item.area }} m²</p>
      <p><strong>Rooms:</strong> {{ item.room_count }}</p>
      <p><strong>Floor:</strong> {{ item.floor }}</p>
      <p><strong>Location:</strong> {{ item.location }}</p>
    </div>

    <div v-if="item.meta?.facilities?.length > 0" class="mt-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Facilities</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li v-for="(facility, index) in item.meta?.facilities" :key="index" class="text-gray-700">
          {{ facility }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
