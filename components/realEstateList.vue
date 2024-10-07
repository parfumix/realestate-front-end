<template>
  <div class="h-full">
    <div class="flex flex-col justify-between  no-scrollbar h-full">
      <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        <li v-for="item in items" :key="item.id" class="relative">
          <div class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <img :src="item.images[0]" :alt="item.description" class="pointer-events-none object-cover group-hover:opacity-75" />
            <button type="button" class="absolute inset-0 focus:outline-none">
              <span class="sr-only">View details for {{ item.description.slice(0, 100) + (item.description.length > 100 ? '...' : '') }}</span>
            </button>
          </div>
          <p class="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{{ item.area }}</p>
          <p class="pointer-events-none block text-sm font-medium text-gray-500">{{ item.description.slice(0, 50) + (item.description.length > 100 ? '...' : '') }}</p>
        </li>
      </ul>
      <Pagination v-if="items.length" />
    </div>
</div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['loadMore']);

const loadMore = () => {
  emit('loadMore');
}

</script>
