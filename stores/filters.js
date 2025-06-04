import { defineStore } from 'pinia'

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

  let activeMessage = ref(null)
  let parsequery = ref(null)

  const route = useRoute()
  const router = useRouter()
  const query = computed(() => route.query)

  // parse filters from route params
  // parse query params from the URL
  const parseSegmentsToFilters = (segments = []) => {
    const filters = {}

    for (const raw of segments) {
      const values = raw.split(',')

      for (let value of values) {
        if (['for-sale', 'for-rent'].includes(value)) {
          filters.transaction_type = [...(filters.transaction_type || []), value]
        } else if (['apartamente', 'case', 'garsoniere'].includes(value)) {
          filters.property_type = [...(filters.property_type || []), value]
        } else if (value.match(/^\d+-\d+\+?$/) || value.endsWith('+')) {
          filters.price = [...(filters.price || []), value]
        } else if (value.endsWith('-camere')) {
          filters.room_count = [...(filters.room_count || []), value.replace('-camere', '')]
        } else if (value.endsWith('-mp')) {
          filters.area = [...(filters.area || []), value.replace('-mp', '')]
        } else if (value.startsWith('etaj-')) {
          filters.floor = [...(filters.floor || []), value.replace('etaj-', '')]
        } else if (value === 'parter') {
          filters.floor = [...(filters.floor || []), '0']
        } else if (value === '7plus-etaj') {
          filters.floor = [...(filters.floor || []), '7+']
        } else if (
          [
            'bucuresti',
            'cluj-napoca',
            'iasi',
            'timisoara',
            'constanta',
            'brasov',
            'sibiu',
            'ploiesti',
            'craiova',
            'oradea',
          ].includes(value)
        ) {
          filters.location = [...(filters.location || []), value]
        }
      }
    }

    return filters
  }

  const buildSegmentsFromFilters = (filters) => {
    const segments = []

    if (filters.transaction_type?.length) segments.push(filters.transaction_type.join(','))

    if (filters.property_type?.length) segments.push(filters.property_type.join(','))

    if (filters.location?.length) segments.push(filters.location.join(','))

    if (filters.room_count?.length)
      segments.push(filters.room_count.map((v) => `${v}-camere`).join(','))

    if (filters.price?.length) segments.push(filters.price.join(','))

    if (filters.area?.length) segments.push(filters.area.map((v) => `${v}-mp`).join(','))

    if (filters.floor?.length)
      segments.push(
        filters.floor
          .map((v) => (v === '0' ? 'parter' : v === '7+' ? '7plus-etaj' : `etaj-${v}`))
          .join(','),
      )

    return segments
  }

  const mappedFilters = parseSegmentsToFilters(route.params.filters || [])
  const activeFilters = reactive(mappedFilters)

  // Watch for changes in activeFilters and update the route params
  watch(
    () => activeFilters,
    (newFilters) => {
      // Update the query params in the route
      const segments = buildSegmentsFromFilters(newFilters)
      const newQuery = { ...query.value, filters: segments.join('/') }

      router.replace(`/search/${segments.join('/')}`)
    },
    { deep: true },
  )

  const mapZoom = ref(null)
  const mapBbox = ref(null)
  const manualMovement = ref(null)

  const hasFiltersChanged = ref(false)

  const resetHasFiltersChanged = () => {
    hasFiltersChanged.value = false
  }

  const setActiveFilter = (filterName, value) => {
    if (!value) {
      delete activeFilters[filterName]
    } else {
      activeFilters[filterName] = value
    }
  }

  const setMapFilters = (zoom = 6, bbox = null, isManualMovement = null) => {
    try {
      mapZoom.value = zoom
      mapBbox.value = bbox
      manualMovement.value = isManualMovement
    } catch (e) {
      console.error('Error saving map filters:', e)
    }
  }

  const resetMapFilters = () => {
    mapZoom.value = null
    mapBbox.value = null
    manualMovement.value = null
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
          resetMapFilters()
        }

        // If new locations added to filters, reset manual movement
        if (afterLocations.length > beforeLocations.length) {
          manualMovement.value = null
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
    manualMovement,

    handleSortOption,

    setActiveFilter,
    setActiveMessage,

    setMapFilters,
    resetMapFilters,

    resetActiveMessage,
    resetActiveFilters,

    resetHasFiltersChanged,
    handleToggleFilter,

    toggleOpen,
  }
})
