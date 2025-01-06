<template>
  <div style="height: calc(100vh - 20px);" class="px-4 sm:px-6 lg:px-8 ml-[20px] sm:mr-[20px] sm:ml-[110px] sm:mr-[40px] mt-[20px]">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-1 sm:flex-row sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Properties</h1>
          <p class="text-sm text-gray-700 mt-1">Manage your properties.</p>
        </div>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <NuxtLink :to="`/properties/new`" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Add property
        </NuxtLink>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 h-full sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full h-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 px-4 w-32 text-left text-sm font-semibold text-gray-900 sm:pl-0"></th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="property in properties" :key="property?.id">
                <td class="whitespace-nowrap py-3 px-4 text-sm sm:pl-0 w-24">
                  <div class="flex items-center">
                    <div class="h-24 w-24 flex-shrink-0">
                      <NuxtLink :to="`/properties/${property?.id}`">
                        <img class="h-24 w-24 rounded-lg" :src="property?.images[0]" alt="" />
                      </NuxtLink>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  <div class="text-medium font-bold text-gray-900">
                    <NuxtLink :to="`/properties/${property?.id}`">
                      {{ property?.title }}
                    </NuxtLink>
                  </div>
                  <div class="mt-1 text-gray-500">{{ truncateString(property?.description, 90) }}</div>
                </td>
                <td class="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <FormOptionsMenu srText="Open the dropdown" :items="menuItems" :element="property" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { truncateString } from '../../utils';

const { getAllProperties, deletePropertyById } = usePropertyService();
const properties = ref([]);

const router = useRouter()

const menuItems = [
  {
    tag: "button",
    label: "Delete",
    onClick: ({ id }) => {
      handleDelete(id)
    },
  },
];

// Fetch properties on component mount
try {
  properties.value = await getAllProperties();
} catch (error) {
  console.error('Error fetching properties:', error);
}

// Handle property deletion
const handleDelete = async (id) => {
  const confirmed = window.confirm('Are you sure you want to delete this property?');
  if (!confirmed) return;

  try {
    await deletePropertyById(id);
    properties.value = properties.value.filter((property) => property?.id !== id);
  } catch (error) {
    console.error('Error deleting property:', error);
  }
}
</script>
