<template>
  <div class="bg-white">
    <!-- Mobile filter dialog -->
    <TransitionRoot as="template" :show="filterStore.open">
      <Dialog as="div" class="relative z-40 sm:hidden" @close="filterStore.toggleOpen()">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
          enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 z-40 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
            enter-from="translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0" leave-to="translate-x-full">
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
                      <div v-for="(option, optionIdx) in section.options" :key="option.value" class="flex items-center">
                        <input :id="`filter-mobile-${section.id}-${optionIdx}`" :name="`${section.id}[]`"
                          :value="option.value" type="checkbox" :checked="option.checked"
                          class="h-4 w-4 rounded border-gray-300 text-grat-600 " />
                        <label :for="`filter-mobile-${section.id}-${optionIdx}`" class="ml-3 text-sm text-gray-500">{{
                          option?.label }}</label>
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
                Sortează
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
                  <a @click="handleSort(option.id)"
                    :class="[activeSorting == option.id ? 'font-medium text-gray-900' : 'text-gray-500', activeSorting == option.id ? 'bg-gray-100' : '', 'block cursor-pointer px-4 py-2 text-sm']">
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
                  <PopoverButton class="group flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    <span v-if="! activeFilters[section.id]?.length">{{ section.name }}</span>
                    <span v-else class="flex items-center" v-html="renderActiveFilters(activeFilters[section.id], section)" />

                    <XCircleIcon v-if="activeFilters?.[section.id]?.length" @click.stop="(e) => handleResetFilterGroup(section.id)" class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                    <ChevronDownIcon v-else class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  </PopoverButton>

                  <transition enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <PopoverPanel
                      class="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl focus:ring-0 focus:outline-none">
                      <form class="space-y-4">
                        <div v-for="(option, optionIdx) in section.options" :key="option.value"
                          class="flex items-center">
                          <input :id="`filter-${section.id}-${optionIdx}`" :name="`${section.id}[]`"
                            :value="option.value" @click="toggleFilter(section.id, option.value)" type="checkbox"
                            :checked="filterStore.activeFilters?.[section.id]?.includes(option.value)"
                            class="h-4 w-4 rounded border-gray-300 text-grat-600" />
                          <label :for="`filter-${section.id}-${optionIdx}`" class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900">{{ option?.label }}</label>
                        </div>
                        <button @click="() => handleResetFilterGroup(section.id)" type="button" class="w-full rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Reset</button>
                      </form>
                    </PopoverPanel>
                  </transition>
                </Popover>
              </PopoverGroup>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
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
import { ChevronDownIcon, XCircleIcon } from '@heroicons/vue/20/solid';

import { useFilterStore } from '@/stores/filters';
import { storeToRefs } from 'pinia'

import { getRomanianBounds } from '~/utils';

const emit = defineEmits(['applyFilters'])

// Use the Pinia filter store
const filterStore = useFilterStore()
const { activeSorting, hasFiltersChanged, activeFilters } = storeToRefs(filterStore)

const renderActiveFilters = (menuFilters, section) => {
  const sliceItems = (sectionId) => {
    if(sectionId == 'price') return 2
    if(sectionId == 'location') return 2
    return 3
  }

  const filterToUpperCase = (el, sectionId) => {
    if(sectionId == 'price') {
      const priceInterval = el.split('-')
      return priceInterval.length > 1 ? formatPriceRange(el.split('-')) : el
    }

    return new String(el)[0].toUpperCase() + (el?.[1] ? el.slice(1) : '')
  }

  function formatPriceRange([min, max]) {
    const formatPrice = (price) => {
      if (price >= 1000) return `€${price / 1000}K`;
      return `€${price}`;
    };

    if (max) {
      return `${formatPrice(min)} - ${formatPrice(max)}`;
    }

    return `${formatPrice(min)}+`;
  }

  let icons = {
    'room_count': '<svg xmlns="http://www.w3.org/2000/svg" class="mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
    'area': '<svg xmlns="http://www.w3.org/2000/svg" class="mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ruler"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
    'floor': '<svg xmlns="http://www.w3.org/2000/svg" class="mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
  }

  let suffix = ''
  if(menuFilters.length > 2 && menuFilters.length < section.options.length) suffix = '..'

  let filtersAsString = menuFilters.map(el => filterToUpperCase(el, section.id)).slice(0, sliceItems(section.id)).join(', ')

  return `${icons?.[section.id] ?? ''} ${filtersAsString} ${suffix}`
}

const handleResetFilterGroup = filterGroupId => {
  filterStore.setActiveFilter(filterGroupId, null)

  hasFiltersChanged.value = true
  if(filterGroupId == 'location') {
    filterStore.setMapFilters(6, getRomanianBounds(true))
  }
}

const handleSort = sort => {
  filterStore.handleSortOption(sort)
}

watch(() => hasFiltersChanged.value, newVal => {
  if(newVal == true) {
    emit('applyFilters')
    filterStore.resetHasFiltersChanged()
  }
})

const toggleFilter = (type, value) => {
  filterStore.handleToggleFilter(type, value)
}
</script>