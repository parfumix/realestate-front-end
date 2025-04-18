<template>
    <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton
          class="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        >
          <span class="sr-only">{{ srText }}</span>
          <slot name="button-icon">
            <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
          </slot>
        </MenuButton>
      </div>
  
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems
          class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="py-1">
            <MenuItem
              v-for="(item, index) in items"
              :key="index"
              v-slot="{ active }"
            >
              <component
                v-if="item.tag === 'button'"
                :is="item.tag"
                :type="item.type || 'button'"
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block w-full px-4 py-2 text-left text-sm'
                ]"
                @click="() => item.onClick(element)"
              >
                {{ item.label }}
              </component>
              <NuxtLink
                v-else-if="item.tag === 'a'"
                :to="item.path"
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block px-4 py-2 text-sm'
                ]"
              >
                {{ item.label }}
            </NuxtLink>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </template>
  
  <script setup>
  import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
  import { EllipsisVerticalIcon } from "@heroicons/vue/20/solid";
  
  // Props for customization
  defineProps({
    srText: {
      type: String,
      default: "Open options",
    },
    element: {
      type: Object,
    },
    items: {
      type: Array,
      default: () => [],
    },
  });
  </script>
  