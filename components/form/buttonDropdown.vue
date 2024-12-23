<template>
    <div class="inline-flex rounded-md shadow-sm">
      <button type="button" @click="handleClick" :disabled="disabled" :class="appliedBtnClass">
        <slot>Save changes</slot>
      </button>
      <Menu as="div" class="relative -ml-px block">
        <MenuButton class="relative inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
          <span class="sr-only">Open options</span>
          <ChevronDown class="h-5 w-5" aria-hidden="true" />
        </MenuButton>
        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
          <MenuItems class="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="py-1">
              <MenuItem v-for="option in options" :key="option.value">
                <a @click="() => handleSecondaryClick(option.value)" :class="[option.active ? 'bg-gray-300 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']" v-tooltip="option.description">{{ option.label }}</a>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </template>
  
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDown } from "lucide-vue-next"
import clsx from 'clsx';

// Props
const props =defineProps({
  text: {
    type: String,
    default: 'Button',
  },
  btnClass: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    default: [],
    required: false
  }
})

const emit = defineEmits(['onClick', 'onSecondaryClick'])

const appliedBtnClass = computed(() => {
    return clsx(props.btnClass + '!bg-white !hover:bg-gray-50 relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10');
})

const handleClick = () => {
  emit('onClick')
}

const handleSecondaryClick = (value) => {
  emit('onSecondaryClick', value)
}
</script>