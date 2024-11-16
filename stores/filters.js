import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filters', () => {
  const open = ref(false);

  const sortOptions = ref([
    { id: 'price_low_to_high', name: 'Preț: Crescător' },
    { id: 'price_high_to_low', name: 'Preț: Descrescător' },
    { id: 'newest_listings', name: 'Cele mai noi' },
  ]);

  const activeSorting = ref('newest_listings')

  const handleSortOption = (option) => {
    activeSorting.value = option
    hasFiltersChanged.value = true
  }

  const filters = ref([
    {
      id: 'transaction_type',
      name: 'Tip Tranzacție',
      options: [
        { value: 'for-sale', label: 'De Vânzare'},
        { value: 'for-rent', label: 'De Închiriat'},
      ],
    },
    {
      id: 'property_type',
      name: 'Tip Proprietate',
      options: [
        { value: 'apartamente', label: 'Apartamente'},
        { value: 'case', label: 'Case'},
        { value: 'garsoniere', label: 'Garsoniere'},
      ],
    },
    {
      id: 'price',
      name: 'Preț',
      options: [
        { value: '0-50000', label: '€0 - €50,000'},
        { value: '50000-100000', label: '€50,000 - €100,000'},
        { value: '100000-150000', label: '€100,000 - €150,000'},
        { value: '150000-200000', label: '€150,000 - €200,000'},
        { value: '200000+', label: '€200,000+'},
      ],
    },
    {
      id: 'room_count',
      name: 'Număr de Camere',
      options: [
        { value: 1, label: '1 Cameră'},
        { value: 2, label: '2 Camere'},
        { value: "3+", label: '3+ Camere'},
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
        { value: 0, label: 'Parter'},
        { value: 1, label: 'Etaj 1'},
        { value: 2, label: 'Etaj 2'},
        { value: 3, label: 'Etaj 3'},
        { value: 4, label: 'Etaj 4'},
        { value: 5, label: 'Etaj 5'},
        { value: 6, label: 'Etaj 6'},
        { value: "7+", label: 'Etaj 7+'},
      ],
    },
    {
      id: 'location',
      name: 'Locație',
      options: [
        { value: 'bucurești', label: 'București' },
        { value: 'cluj-napoca', label: 'Cluj-Napoca' },
        { value: 'iași', label: 'Iași' },
        { value: 'timișoara', label: 'Timișoara' },
        { value: 'constanța', label: 'Constanța' },
        { value: 'brașov', label: 'Brașov' },
        { value: 'sibiu', label: 'Sibiu' },
        { value: 'ploiești', label: 'Ploiești' },
        { value: 'craiova', label: 'Craiova' },
        { value: 'oradea', label: 'Oradea' },
      ]
    },
  ])

  const hasFiltersChanged = ref(false)
  const resetHasFiltersChanged = () => {
    hasFiltersChanged.value = false
  }

  const defaultFilters = {
    "property_type": [],
    "price": [],
    "room_count": [],
    "area:": [],
    "floor": [],
    "location": [],
    "transaction_type": [],
  }

  // by default trying to reach localStorage filters, if not accesible than use default filters
  let activeMessage = ref(null)
  let activeFilters = reactive(JSON.parse(localStorage.getItem('defaultFilters')) ?? defaultFilters);

  let mapZoom = ref(parseInt(localStorage.getItem('mapZoom') ?? 7))
  let mapBbox = ref(localStorage.getItem('mapBbox') ? JSON.parse(localStorage.getItem('mapBbox')) : null)

  // set filters to localStorage any time filters changes
  watch(() => hasFiltersChanged.value, () => {
    Object.keys(activeFilters).length === 0
      ? localStorage.removeItem('defaultFilters')
      : localStorage.setItem('defaultFilters', JSON.stringify(activeFilters))
  })

  const setActiveFilter = (filterName, value) => {
    activeFilters[filterName] = value;
  }

  const setMapFilters = (zoom = 6, bbox = null) => {
    mapZoom.value = zoom
    mapBbox.value = bbox

    localStorage.setItem('mapZoom', parseInt(zoom))
    localStorage.setItem('mapBbox', JSON.stringify(bbox))
  }

  const resetMapFilters = () => {
    setMapFilters(null, null)
  }

  const setActiveMesasge = (message) => {
    activeMessage.value = message
  }

  const resetActiveMessage = () => {
    activeMessage.value = null
  }

  const resetActiveFilters = () => {
    activeFilters = defaultFilters
  }

  const handleToggleFilter = (type, value) => {
    if(type == 'location') setMapFilters(11)
    activeMessage.value = null

    let valueIndex = activeFilters?.[type].findIndex(el => el == value);

    if (valueIndex >= 0) {
      // Remove the value if it exists
      activeFilters?.[type].splice(valueIndex, 1);
    } else {
      // Add the value if it does not exist
      activeFilters[type] = [...activeFilters[type], value];
    }

    hasFiltersChanged.value = true
  }

  const toggleOpen = () => {
    open.value = !open.value;
  }

  return {
    open,
    sortOptions,
    activeSorting,
    hasFiltersChanged,

    filters,
    activeFilters,
    activeMessage,

    mapZoom,
    mapBbox,

    handleSortOption,

    setActiveFilter,
    setActiveMesasge,

    resetMapFilters,
    setMapFilters,

    resetActiveMessage,
    resetActiveFilters,
    
    resetHasFiltersChanged,
    handleToggleFilter,

    toggleOpen,
  }
})
