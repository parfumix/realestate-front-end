import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filters', () => {
  const open = ref(false);

  const sortOptions = ref([
    { id: 'price_low_to_high', name: 'Price: Low to High' },
    { id: 'price_high_to_low', name: 'Price: High to Low' },
    { id: 'newest_listings', name: 'Newest Listings' },
    { id: 'most_popular', name: 'Most Popular' },
  ]);

  const activeSorting = ref('most_popular')

  const filters = ref([
    {
      id: 'property-type',
      name: 'Property Type',
      options: [
        { value: 'house', label: 'House'},
        { value: 'apartment', label: 'Apartment'},
        { value: 'condo', label: 'Condo'},
      ],
    },
    {
      id: 'price',
      name: 'Price Range',
      options: [
        { value: '0-50000', label: '$0 - $50,000'},
        { value: '50000-100000', label: '$50,000 - $100,000'},
        { value: '100000-200000', label: '$100,000 - $200,000'},
      ],
    },
    {
      id: 'bedrooms',
      name: 'Bedrooms',
      options: [
        { value: '1', label: '1 Bedroom'},
        { value: '2', label: '2 Bedrooms'},
        { value: '3', label: '3+ Bedrooms'},
      ],
    },
    {
      id: 'bathrooms',
      name: 'Bathrooms',
      options: [
        { value: '1', label: '1 Bathroom'},
        { value: '2', label: '2 Bathrooms'},
        { value: '3', label: '3+ Bathrooms'},
      ],
    },
    {
      id: 'location',
      name: 'Location',
      options: [
        { value: 'city-center', label: 'City Center'},
        { value: 'suburbs', label: 'Suburbs'},
        { value: 'rural', label: 'Rural'},
      ],
    },
  ])

  const activeFilters = reactive({
    'property-type': [],
    'price': [],
    'bedrooms': [],
    'bathrooms': [],
    'location': [],
  });

  const setActiveFilter = (filterName, value) => {
    activeFilters[filterName] = value;
  };
  
  const handleToggleFilter = (type, value) => {
    let valueIndex = activeFilters?.[type].findIndex(el => el == value);
  
    if (valueIndex >= 0) {
      // Remove the value if it exists
      activeFilters?.[type].splice(valueIndex, 1);
    } else {
      // Add the value if it does not exist
      activeFilters[type] = [...activeFilters[type], value];
    }
  }

  const toggleOpen = () => {
    open.value = !open.value;
  }

  return {
    open,
    sortOptions,
    activeSorting,

    filters,
    activeFilters,
    handleToggleFilter,
    setActiveFilter,

    toggleOpen,
  }
})
