import { defineStore } from 'pinia'
import { ref } from 'vue'

import { fetchItems, fetchItemBySlug } from '../api/items'
import { removeEmptyValues } from '../utils'

export const useItemsStore = defineStore('itemsStore', () => {
  // Item type constants
  const TYPE_MAP_ITEMS = 'map'
  const TYPE_LIST_ITEMS = 'list'
  const TYPE_LIST_HYBRID = 'hybrid'

  // Default view mode state
  const defaultView = ref(TYPE_LIST_HYBRID)

  // Loading states
  const isItemsLoaded = ref(false)
  const isQueryLoading = ref(false)
  const isQueryLoadingChat = ref(false)

  // Items management
  const items = ref([])
  const mapItems = ref([])
  const hoveredItem = ref(null)

  const resetTrigger = ref(0)
  const isChatInlineHasBeenMounted = ref(false)

  const paginationOffset = ref(12) // Initial offset
  const isLoadingMore = ref(false)
  const isScrollingDown = ref(false)
  const noMoreValues = ref(false)
  const ITEMS_PER_PAGE = 12

  // Map refresh state
  const triggeredRefreshMap = ref(false)
  const handleTriggerRefreshMap = (mode = true) => {
    triggeredRefreshMap.value = mode
  }

  const handleHoverItem = (item) => {
    hoveredItem.value = item
  }

  const findItemBySlug = async (slug) => {
    let item = items.value.find((el) => el.slug == slug)
    if(! item) {
      const { data, error } = await fetchItemBySlug(slug)
      if (error.value) throw new Error(error.value)
      item = data.value?.data || null
    }
    return item
  }

  const handleUpdateItem = (itemId, newData) => {
    const index = items.value.findIndex((el) => el.id === itemId)
    if (index == -1) return
    items.value[index] = { ...items.value[index], ...newData }
  }

  const handleRemoveItem = (itemId) => {
    const index = items.value.findIndex((el) => el.id === itemId)
    if (index !== -1) items.value.splice(index, 1)
  }

  const handleResetItems = (type = null) => {
    if (!type) {
      items.value = []
      mapItems.value = []
    }

    if (type == TYPE_LIST_ITEMS) items.value = []
    if (type == TYPE_MAP_ITEMS) mapItems.value = []

    resetTrigger.value++
  }

  const handlePushItem = (item, type = TYPE_LIST_ITEMS) => {
    if (type == TYPE_LIST_ITEMS) items.value.push(item)
    if (type == TYPE_MAP_ITEMS) mapItems.value.push(item)
  }

  const handlePushItems = ({ items: newItems = [], mapItems: newMapItems = [] }) => {
    if (newItems.length) items.value = [...items.value, ...newItems]
    if (newMapItems.length) mapItems.value = [...mapItems.value, ...newMapItems]
  }

  const handleFetchItems = async (
    q = null,
    filters = null,
    mapFilters = null,
    offset = null,
    parsequery = null,
    activeSorting = null,
  ) => {
    try {
      isQueryLoading.value = true

      const viewMode = TYPE_LIST_HYBRID

      const filteredFilters = removeEmptyValues(filters)
      const haveAnyFilters = Object.keys(filteredFilters).length

      // We might want a separate loading state for map items
      const filteredMapFilters = removeEmptyValues(mapFilters)
      const haveAnyMapFilters = Object.keys(filteredMapFilters).length

      const { data, error } = await fetchItems(
        q,
        haveAnyFilters ? filteredFilters : null,
        haveAnyMapFilters ? filteredMapFilters : null,
        offset,
        parsequery,
        activeSorting,
        viewMode,
      )

      if (error.value) throw new Error(error.value)
      return data.value // Deep clone to avoid reactivity issues
    } catch (err) {
      console.error('Error in handleFetchItems:', err)
      throw err
    } finally {
      isQueryLoading.value = false
      isItemsLoaded.value = true
    }
  }

  const resetPagination = () => {
    paginationOffset.value = ITEMS_PER_PAGE
    noMoreValues.value = false
  }

  const loadMoreItems = async ({
    activeMessage,
    activeFilters,
    activeSorting,
    mapZoom,
    mapBbox,
    manualMovement = false,
    parsequery,
  }) => {
    if (isLoadingMore.value || noMoreValues.value) return false

    try {
      isLoadingMore.value = true
      isScrollingDown.value = true

      const { items } = await handleFetchItems(
        activeMessage,
        activeFilters,
        { zoom: mapZoom, bbox: mapBbox, manualMovement },
        paginationOffset.value,
        parsequery,
        activeSorting,
      )

      if (!items.length) {
        noMoreValues.value = true
        return false
      }

      paginationOffset.value += ITEMS_PER_PAGE
      handlePushItems({ items })

      return true
    } catch (err) {
      console.error('Error loading more items:', err)
      return false
    } finally {
      isLoadingMore.value = false
      isScrollingDown.value = false
    }
  }

  // Set view mode and save to localStorage
  const setDefaultView = (newViewMode) => {
    if (defaultView.value !== newViewMode) {
      defaultView.value = newViewMode
      //localStorage.setItem('defaultView', newViewMode)
    }
  }

  // Return items-related functionality
  return {
    // Constants
    TYPE_MAP_ITEMS,
    TYPE_LIST_ITEMS,
    TYPE_LIST_HYBRID,

    // Map refresh
    triggeredRefreshMap,
    handleTriggerRefreshMap,

    // Items
    items,
    mapItems,
    hoveredItem,
    handleUpdateItem,
    handleRemoveItem,
    handleHoverItem,
    handleResetItems,
    handlePushItem,
    handlePushItems,
    findItemBySlug,

    // Loading states
    isQueryLoading,
    isQueryLoadingChat,
    isItemsLoaded,

    // API interactions
    handleFetchItems,

    // loading more pagination state
    paginationOffset,
    isLoadingMore,
    isScrollingDown,
    noMoreValues,
    ITEMS_PER_PAGE,
    resetPagination,
    loadMoreItems,

    setDefaultView,
    defaultView,
    resetTrigger,
    isChatInlineHasBeenMounted,
  }
})
