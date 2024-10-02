<template>
    <div class="bg-white">
      <!-- Mobile filter dialog -->
      <TransitionRoot as="template" :show="filterStore.open">
        <Dialog as="div" class="relative z-40 sm:hidden" @close="filterStore.toggleOpen()">
          <TransitionChild as="template" enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
            leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>
  
          <div class="fixed inset-0 z-40 flex">
            <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
              enter-from="translate-x-full" enter-to="translate-x-0"
              leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
              leave-to="translate-x-full">
              <DialogPanel
                class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div class="flex items-center justify-between px-4">
                  <h2 class="text-lg font-medium text-gray-900">Filters</h2>
                  <button type="button"
                    class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    @click="filterStore.toggleOpen()">
                    <span class="sr-only">Close menu</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
  
                <!-- Filters -->
                <form class="mt-4">
                  <Disclosure as="div" v-for="section in filterStore.filters" :key="section.name"
                    class="border-t border-gray-200 px-4 py-6" v-slot="{ open }">
                    <h3 class="-mx-2 -my-3 flow-root">
                      <DisclosureButton
                        class="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                        <span class="font-medium text-gray-900">{{ section.name }}</span>
                        <span class="ml-6 flex items-center">
                          <ChevronDownIcon :class="[open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform']"
                            aria-hidden="true" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel class="pt-6">
                      <div class="space-y-6">
                        <div v-for="(option, optionIdx) in section.options" :key="option.value"
                          class="flex items-center">
                          <input :id="`filter-mobile-${section.id}-${optionIdx}`" :name="`${section.id}[]`"
                            :value="option.value" type="checkbox" :checked="option.checked"
                            class="h-4 w-4 rounded border-gray-300 text-grat-600 " />
                          <label :for="`filter-mobile-${section.id}-${optionIdx}`"
                            class="ml-3 text-sm text-gray-500">{{ option.label }}</label>
                        </div>
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
  
      <!-- Filters -->
      <section aria-labelledby="filter-heading" class="mt-3">
        <h2 id="filter-heading" class="sr-only">Filters</h2>
        <div class="border-b border-gray-200 bg-white pb-4">
          <div class="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                  class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true" />
                </MenuButton>
              </div>
  
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl focus:ring-0 focus:outline-none">
                  <div class="py-1">
                    <MenuItem v-for="option in filterStore.sortOptions" :key="option.id">
                      <a @click="filterStore.activeSorting=option.id" :class="[activeSorting == option.id ? 'font-medium text-gray-900' : 'text-gray-500', activeSorting == option.id ? 'bg-gray-100' : '', 'block cursor-pointer px-4 py-2 text-sm']">
                        {{ option.name }}
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
  
            <button type="button" class="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden" @click="filterStore.toggleOpen()">Filters</button>
  
            <div class="hidden sm:block">
              <div class="flow-root">
                <PopoverGroup class="-mx-4 flex items-center divide-x divide-gray-200">
                  <Popover v-for="(section, sectionIdx) in filterStore.filters" :key="sectionIdx"
                    class="relative inline-block px-4 text-left">
                    <PopoverButton class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      <span>{{ section.name }}</span>
                      <ChevronDownIcon class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                    </PopoverButton>
  
                    <transition enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95">
                      <PopoverPanel class="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl focus:ring-0 focus:outline-none">
                        <form class="space-y-4">
                          <div v-for="(option, optionIdx) in section.options" :key="option.value" class="flex items-center">
                            <input :id="`filter-${section.id}-${optionIdx}`" :name="`${section.id}[]`" :value="option.value" @click="toggleFilter(section.id, option.value)" type="checkbox" :checked="filterStore.activeFilters[section.id].includes(option.value)" class="h-4 w-4 rounded border-gray-300 text-grat-600" />
                            <label :for="`filter-${section.id}-${optionIdx}`" class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900">{{ option.label }}</label>
                          </div>
                        </form>
                      </PopoverPanel>
                    </transition>
                  </Popover>
                </PopoverGroup>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Active filters -->
        <div class="bg-gray-100 py-1">
          <div class="mx-auto max-w-7xl px-4 sm:flex sm:items-center sm:px-6 lg:px-8 min-h-10">
            <h3 class="text-sm font-medium text-gray-500">
              Filters
              <span class="sr-only">, active</span>
            </h3>
  
            <div class="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"></div>
  
            <div class="mt-2 sm:ml-4 sm:mt-0">
              <div class="-m-1 flex flex-wrap items-center">
                <span v-for="(activeFilter, index) in filterStore.activeFilters" :key="index" class="flex flex-row">
                  <span v-for="filter in activeFilter" :key="`${index}-sub`" class="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                    <span>{{ filters.find(el => el.id == index)['options'].find(el => el.value == filter).label }}</span>
                    <button type="button" @click="toggleFilter(index, filter)" class="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500">
                      <span class="sr-only">Remove filter for {{ filter }}</span>
                      <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                        <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
                      </svg>
                    </button>
                  </span>
                 
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { useFilterStore } from '@/stores/filters';
  import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue';
  import { XMarkIcon } from '@heroicons/vue/24/outline';
  import { ChevronDownIcon } from '@heroicons/vue/20/solid';
  
  import { storeToRefs } from 'pinia'

  // Use the Pinia filter store
  const filterStore = useFilterStore()
  const { filters, activeSorting } = storeToRefs(filterStore)

  const toggleFilter = (type, value) => {
    filterStore.handleToggleFilter(type, value)
  }
  </script>
  