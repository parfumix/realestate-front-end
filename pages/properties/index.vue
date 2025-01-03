<template>
    <main class="flex flex-row space-x-2 ml-40">
        <div class="w-full md:mx-auto flex">
            <ul role="list" class="divide-y divide-gray-100">
                <li v-for="property in properties" :key="property?.id"
                    class="flex items-center justify-between gap-x-6 py-5">
                    <div class="min-w-0">
                        <div class="flex items-start gap-x-3">
                            <p class="text-sm font-semibold leading-6 text-gray-900">{{ property?.title }}</p>
                        </div>
                        <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                            <p class="whitespace-nowrap">
                                Due on <time :datetime="property?.dueDateTime">{{ property?.dueDate }}</time>
                            </p>
                            <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
                                <circle cx="1" cy="1" r="1" />
                            </svg>
                            <p class="truncate">Created by {{ property?.createdBy }}</p>
                        </div>
                    </div>
                    <div class="flex flex-none items-center gap-x-4">
                        <NuxtLink :to="`/properties/${property?.id}`" class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">View property<span class="sr-only">, {{ property?.name }}</span></NuxtLink>
                        <Menu as="div" class="relative flex-none">
                            <MenuButton class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                <span class="sr-only">Open options</span>
                                <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                            </MenuButton>
                            <transition enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
                                <MenuItems
                                    class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                    <MenuItem v-slot="{ active }">
                                    <a href="#"
                                        :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">Edit<span
                                            class="sr-only">, {{ property?.name }}</span></a>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <a href="#"
                                        :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">Move<span
                                            class="sr-only">, {{ property?.name }}</span></a>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <a href="#"
                                        :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">Delete<span
                                            class="sr-only">, {{ property?.name }}</span></a>
                                    </MenuItem>
                                </MenuItems>
                            </transition>
                        </Menu>
                    </div>
                </li>
            </ul>
        </div>
    </main>
</template>


<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'

const { getAllProperties, deletePropertyBySlug } = usePropertyService()
const { notify } = useNotification()

const properties = ref([])
properties.value = await getAllProperties()
</script>