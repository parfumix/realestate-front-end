<template>
    <main class="flex flex-row space-x-2 ml-40">
      <div class="w-full md:mx-auto flex">
        <ul role="list" class="divide-y divide-gray-100 w-full">
          <li
            v-for="property in properties"
            :key="property.id"
            class="flex items-center justify-between gap-x-6 py-5"
          >
            <!-- Property Details -->
            <div class="min-w-0">
              <div class="flex items-start gap-x-3">
                <p class="text-sm font-semibold leading-6 text-gray-900">
                  {{ property.title }}
                </p>
              </div>
              <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p class="whitespace-wrap">
                  {{ truncateString(property.description, 150) }}
                </p>
              </div>
            </div>
  
            <!-- Actions -->
            <div class="flex flex-none items-center gap-x-4">
              <NuxtLink
                :to="`/properties/${property.id}`"
                class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                View property
              </NuxtLink>
              <FormButton @click="handleDelete(property.id)">Delete</FormButton>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </template>
  
  <script setup>
  import { truncateString } from '../../utils';
  
  const { getAllProperties, deletePropertyById } = usePropertyService();
  const properties = ref([]);
  
  // Fetch properties on component mount
  onMounted(async () => {
    try {
      properties.value = await getAllProperties();
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  });
  
  // Handle property deletion
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this property?');
    if (!confirmed) return;
  
    try {
      await deletePropertyById(id);
      properties.value = properties.value.filter((property) => property.id !== id);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };
  </script>
  