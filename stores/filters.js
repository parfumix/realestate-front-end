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
      id: 'transaction-type',
      name: 'Tip Tranzacție',
      options: [
        { value: 'for-sale', label: 'De Vânzare'},
        { value: 'for-rent', label: 'De Închiriat'},
      ],
    },
    {
      id: 'property-type',
      name: 'Tip Proprietate',
      options: [
        { value: 'apartamente', label: 'Apartamente'},
        { value: 'case', label: 'Case'},
        { value: 'garsoniere', label: 'Garsoniere'},
      ],
    },
    {
      id: 'price',
      name: 'Interval Preț',
      options: [
        { value: '0-50000', label: '€0 - €50,000'},
        { value: '50000-100000', label: '€50,000 - €100,000'},
        { value: '100000-150000', label: '€100,000 - €150,000'},
        { value: '150000-200000', label: '€150,000 - €200,000'},
        { value: '200000+', label: '€200,000+'},
      ],
    },
    {
      id: 'rooms',
      name: 'Număr de Camere',
      options: [
        { value: '1', label: '1 Cameră'},
        { value: '2', label: '2 Camere'},
        { value: '3', label: '3+ Camere'},
      ],
    },
    {
      id: 'area',
      name: 'Suprafață',
      options: [
        { value: '0-50', label: '0 - 50 m²'},
        { value: '50-100', label: '50 - 100 m²'},
        { value: '100-150', label: '100 - 150 m²'},
        { value: '150-200', label: '150 - 200 m²'},
        { value: '200+', label: '200+ m²'},
      ],
    },
    {
      id: 'floor',
      name: 'Etaj',
      options: [
        { value: 'parter', label: 'Parter'},
        { value: '1', label: 'Etaj 1'},
        { value: '2', label: 'Etaj 2'},
        { value: '3+', label: 'Etaj 3+'},
      ],
    },
    {
      id: 'location',
      name: 'Locație',
      options: [
        { value: 'bucharest', label: 'București'},
        { value: 'cluj-napoca', label: 'Cluj-Napoca'},
        { value: 'iasi', label: 'Iași'},
        { value: 'timisoara', label: 'Timișoara'},
        { value: 'constanta', label: 'Constanța'},
        { value: 'brasov', label: 'Brașov'},
        { value: 'sibiu', label: 'Sibiu'},
        { value: 'ploiesti', label: 'Ploiești'},
        { value: 'craiova', label: 'Craiova'},
        { value: 'oradea', label: 'Oradea'},
      ],
    },
  ])


  const defaultFilters = {
    'property-type': [],
    'price': [],
    'rooms': [],
    'area': [],
    'floor': [],
    'location': [],
    'transaction-type': [],
  }
  const activeFilters = reactive(defaultFilters);

  const setActiveFilter = (filterName, value) => {
    activeFilters[filterName] = value;
  }

  const resetActiveFilters = () => {
    activeFilters = defaultFilters
  }

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
    resetActiveFilters,

    toggleOpen,
  }
})
