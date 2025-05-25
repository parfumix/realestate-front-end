import { defineStore } from 'pinia'
import { getRomanianBounds } from '~/utils'

export const useFilterStore = defineStore('filtersStore', () => {
  const open = ref(false)

  const sortOptions = ref([
    { id: 'price_low_to_high', name: 'Preț: Crescător' },
    { id: 'price_high_to_low', name: 'Preț: Descrescător' },
    { id: 'newest_listings', name: 'Cele mai noi' },
  ])

  const activeSorting = ref('newest_listings')

  const activeSortingTitle = computed(() => {
    let foundElement = sortOptions.value.find((el) => el.id == activeSorting.value)
    return foundElement?.['name'] || 'Sortează'
  })

  const handleSortOption = (option) => {
    activeSorting.value = option
    hasFiltersChanged.value = true
  }

  const filters = ref([
    {
      id: 'transaction_type',
      name: 'Tip Tranzacție',
      options: [
        { value: 'for-sale', label: 'De Vânzare' },
        { value: 'for-rent', label: 'De Închiriat' },
      ],
    },
    {
      id: 'property_type',
      name: 'Tip Proprietate',
      options: [
        { value: 'apartamente', label: 'Apartamente' },
        { value: 'case', label: 'Case' },
        { value: 'garsoniere', label: 'Garsoniere' },
      ],
    },
    {
      id: 'price',
      name: 'Preț',
      options: [
        { value: '0-50000', label: '€0 - €50,000' },
        { value: '50000-100000', label: '€50,000 - €100,000' },
        { value: '100000-150000', label: '€100,000 - €150,000' },
        { value: '150000-200000', label: '€150,000 - €200,000' },
        { value: '200000+', label: '€200,000+' },
      ],
    },
    {
      id: 'room_count',
      name: 'Număr de Camere',
      options: [
        { value: 1, label: '1 Cameră' },
        { value: 2, label: '2 Camere' },
        { value: '3+', label: '3+ Camere' },
      ],
    },
    {
      id: 'area',
      name: 'Suprafață',
      options: [
        { value: '0-50', label: '0 - 50 m²' },
        { value: '50-100', label: '50 - 100 m²' },
        { value: '100-150', label: '100 - 150 m²' },
        { value: '150-200', label: '150 - 200 m²' },
        { value: '200+', label: '200+ m²' },
      ],
    },
    {
      id: 'floor',
      name: 'Etaj',
      options: [
        { value: 0, label: 'Parter' },
        { value: 1, label: 'Etaj 1' },
        { value: 2, label: 'Etaj 2' },
        { value: 3, label: 'Etaj 3' },
        { value: 4, label: 'Etaj 4' },
        { value: 5, label: 'Etaj 5' },
        { value: 6, label: 'Etaj 6' },
        { value: '7+', label: 'Etaj 7+' },
      ],
    },
    {
      id: 'location',
      name: 'Locație',
      options: [
        { value: 'bucuresti', label: 'București' },
        { value: 'cluj-napoca', label: 'Cluj-Napoca' },
        { value: 'iasi', label: 'Iași' },
        { value: 'timisoara', label: 'Timișoara' },
        { value: 'constanta', label: 'Constanța' },
        { value: 'brasov', label: 'Brașov' },
        { value: 'sibiu', label: 'Sibiu' },
        { value: 'ploiesti', label: 'Ploiești' },
        { value: 'craiova', label: 'Craiova' },
        { value: 'oradea', label: 'Oradea' },
      ],
    },
  ])

  const defaultFilters = {
    property_type: [],
    price: [],
    room_count: [],
    area: [],
    floor: [],
    location: [],
    transaction_type: [],
  }

  // by default trying to reach localStorage filters, if not accesible than use default filters
  let activeMessage = ref(null)
  let parsequery = ref(null)

  // Initialize activeFilters with safe fallback
  const savedFilters = () => {
    try {
      const saved = localStorage.getItem('defaultFilters')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      console.error('Error parsing saved filters:', e)
      return null
    }
  }

  const activeFilters = process.client
    ? reactive(savedFilters() || { ...defaultFilters })
    : reactive({})

  let mapZoom = process.client ? ref(parseInt(localStorage.getItem('mapZoom') ?? 7)) : null
  let mapBbox = process.client
    ? ref(localStorage.getItem('mapBbox') ? JSON.parse(localStorage.getItem('mapBbox')) : null)
    : null

  const hasFiltersChanged = ref(false)
  const resetHasFiltersChanged = () => {
    hasFiltersChanged.value = false
  }

  // set filters to localStorage any time filters changes
  watch(
    () => hasFiltersChanged.value,
    () => {
      if (hasFiltersChanged.value) {
        try {
          if (Object.keys(activeFilters).length === 0) {
            localStorage.removeItem('defaultFilters')
          } else {
            localStorage.setItem('defaultFilters', JSON.stringify(activeFilters))
          }
          localStorage.setItem('activeSorting', activeSorting.value)
        } catch (e) {
          console.error('Error saving filters to localStorage:', e)
        }
      }
    },
  )

  const setActiveFilter = (filterName, value) => {
    if (!value) {
      delete activeFilters[filterName]
    } else {
      activeFilters[filterName] = value
    }
  }

  const setMapFilters = (zoom = 6, bbox = null) => {
    try {
      mapZoom.value = zoom
      mapBbox.value = bbox

      localStorage.setItem('mapZoom', String(parseInt(zoom)))
      localStorage.setItem('mapBbox', JSON.stringify(bbox))
    } catch (e) {
      console.error('Error saving map filters:', e)
    }
  }

  const resetMapFilters = () => {
    setMapFilters(null, null)
  }

  const setActiveMessage = (message) => {
    activeMessage.value = message
  }

  const resetActiveMessage = () => {
    activeMessage.value = null
  }

  const resetActiveFilters = () => {
    // First clear all existing filters
    Object.keys(activeFilters).forEach((key) => {
      delete activeFilters[key]
    })

    // Then repopulate with default values
    Object.entries(defaultFilters).forEach(([key, value]) => {
      activeFilters[key] = Array.isArray(value) ? [...value] : value
    })
  }

  const handleToggleFilter = (type, value) => {
    // Reset active search query
    activeMessage.value = null

    // Special handling for location filters
    const isLocationFilter = type === 'location'
    const beforeLocations = isLocationFilter ? [...(activeFilters?.[type] || [])] : []

    // Ensure filter type exists in activeFilters
    if (!activeFilters[type]) {
      activeFilters[type] = []
    }

    try {
      // Find if value already exists
      const valueIndex = activeFilters[type].findIndex((el) => el === value)

      if (valueIndex >= 0) {
        // Remove value (toggle off)
        activeFilters[type].splice(valueIndex, 1)

        // Clean up empty arrays
        if (activeFilters[type].length === 0) {
          delete activeFilters[type]
        }
      } else {
        // Add value (toggle on)
        activeFilters[type] = [...activeFilters[type], value]
      }

      // Get updated locations after changes
      const afterLocations = activeFilters?.location || []

      // Reset map bounds logic
      if (isLocationFilter) {
        // If all location filters were removed, reset to Romania bounds
        if (beforeLocations.length && afterLocations.length === 0) {
          setMapFilters(6, getRomanianBounds(true))
        }
      }

      // Signal that filters have changed to trigger data refresh
      hasFiltersChanged.value = true
    } catch (error) {
      console.error(`Error toggling filter ${type}:${value}`, error)
      // Optionally show a user-friendly error message
    }
  }

  const toggleOpen = () => {
    open.value = !open.value
  }

  return {
    open,
    sortOptions,
    activeSortingTitle,
    activeSorting,
    hasFiltersChanged,

    filters,
    activeFilters,
    activeMessage,
    parsequery,

    mapZoom,
    mapBbox,

    handleSortOption,

    setActiveFilter,
    setActiveMessage,

    resetMapFilters,
    setMapFilters,

    resetActiveMessage,
    resetActiveFilters,

    resetHasFiltersChanged,
    handleToggleFilter,

    toggleOpen,
  }
})
