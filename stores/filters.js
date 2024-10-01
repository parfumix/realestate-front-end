// stores/filters.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFilterStore = defineStore('filters', () => {
  const open = ref(false);

  const sortOptions = ref([
    { name: 'Price: Low to High', href: '#', current: true },
    { name: 'Price: High to Low', href: '#', current: false },
    { name: 'Newest Listings', href: '#', current: false },
    { name: 'Most Popular', href: '#', current: false },
  ]);

  const filters = ref([
    {
      id: 'property-type',
      name: 'Property Type',
      options: [
        { value: 'house', label: 'House', checked: false },
        { value: 'apartment', label: 'Apartment', checked: false },
        { value: 'condo', label: 'Condo', checked: false },
      ],
    },
    {
      id: 'price',
      name: 'Price Range',
      options: [
        { value: '0-50000', label: '$0 - $50,000', checked: false },
        { value: '50000-100000', label: '$50,000 - $100,000', checked: false },
        { value: '100000-200000', label: '$100,000 - $200,000', checked: false },
      ],
    },
    {
      id: 'bedrooms',
      name: 'Bedrooms',
      options: [
        { value: '1', label: '1 Bedroom', checked: false },
        { value: '2', label: '2 Bedrooms', checked: false },
        { value: '3', label: '3+ Bedrooms', checked: false },
      ],
    },
    {
      id: 'bathrooms',
      name: 'Bathrooms',
      options: [
        { value: '1', label: '1 Bathroom', checked: false },
        { value: '2', label: '2 Bathrooms', checked: false },
        { value: '3', label: '3+ Bathrooms', checked: false },
      ],
    },
    {
      id: 'location',
      name: 'Location',
      options: [
        { value: 'city-center', label: 'City Center', checked: false },
        { value: 'suburbs', label: 'Suburbs', checked: false },
        { value: 'rural', label: 'Rural', checked: false },
      ],
    },
  ]);

  const activeFilters = ref([{ value: 'apartment', label: 'Apartment' }]);

  const toggleOpen = () => {
    open.value = !open.value;
  };

  return {
    open,
    sortOptions,
    filters,
    activeFilters,
    toggleOpen,
  };
});
