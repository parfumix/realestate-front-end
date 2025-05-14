import { defineStore } from 'pinia'
import {
  querySuggestions,
  getCombinedQueries,
  getRecentQueries,
  getPopularQueries,
} from '~/api/querySuggestions'
import { normalizeQuery } from '~/utils'
import { ref } from 'vue'

export const useSearchQueryStore = defineStore('searchQuery', () => {
  const term = ref('')

  const results = ref([])
  const recentQueries = ref([])
  const popularQueries = ref([])

  const isLoading = ref(false)
  const isCombinedLoading = ref(false)
  const isRecentLoading = ref(false)
  const isPopularLoading = ref(false)

  const cache = ref({}) // { normalized_term: [...] }
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

  // Fetch suggestions based on the input term
  const fetchSuggestions = async (input) => {
    term.value = input
    const normalized = normalizeQuery(input)

    if (normalized.length < 3) {
      results.value = []
      return
    }

    const now = Date.now()

    // Check cache with expiration
    if (cache.value[normalized]) {
      const cached = cache.value[normalized]
      if (now - cached.timestamp < CACHE_TTL) {
        results.value = cached.value
        return
      } else {
        delete cache.value[normalized]
      }
    }

    isLoading.value = true

    try {
      const { data } = await querySuggestions(normalized)
      const { data: suggestions } = data?.value || {}

      const mapped = suggestions.map(el => ({ ...el, type: 'suggestion' }))

      if (mapped.length) {
        results.value = mapped
        cache.value[normalized] = {
          value: mapped,
          timestamp: now,
        }
      } else {
        results.value = []
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err)
      throw err
    } finally {
      setTimeout(() => {
        isLoading.value = false
      }, 300)
    }
  }

  // Fetch combined queries with a default limit of 10
  const fetchCombinedQueries = async () => {
    isCombinedLoading.value = true

    try {
      const { data } = await getCombinedQueries(5)
      const { recent_queries, popular_queries } = data?.value || {}

      // Normalize the recent queries
      recentQueries.value = JSON.parse(JSON.stringify(recent_queries)).map(el => ({...el, ...{type: 'recent'}}))
      popularQueries.value = JSON.parse(JSON.stringify(popular_queries)).map(el => ({...el, ...{type: 'popular'}}))
    } catch (err) {
      console.error('Error fetching combined queries:', err)
      throw err
    } finally {
      isCombinedLoading.value = false
    }
  }

  // Fetch recent queries with a default limit of 5
  const fetchRecentQueries = async (limit = 5) => {
    isRecentLoading.value = true

    try {
      const recent = await getRecentQueries(limit)
      recentQueries.value = recent
    } catch (err) {
      console.error('Error fetching recent queries:', err)
      throw err
    } finally {
      isRecentLoading.value = false
    }
  }

  // Fetch popular queries with a default limit of 10
  const fetchPopularQueries = async (limit = 10) => {
    isPopularLoading.value = true

    try {
      const popular = await getPopularQueries(limit)
      popularQueries.value = popular
    } catch (err) {
      console.error('Error fetching popular queries:', err)
      throw err
    } finally {
      isPopularLoading.value = false
    }
  }

  // === Helpers for recentQueries ===
  const addToRecentQueries = (queryString) => {
    const normalized = normalizeQuery(queryString)

    // Prevent duplicates
    if (!recentQueries.value.some(q => normalizeQuery(q.normalized_query) === normalized)) {
      recentQueries.value.unshift({
        query: queryString,
        normalized_query: normalized,
        search_count: 1,
      })
    }
  }
  
  const removeFromRecentQueries = (queryString) => {
    const normalized = normalizeQuery(queryString)
    recentQueries.value = recentQueries.value.filter(
      (q) => normalizeQuery(q.normalized_query) !== normalized,
    )
  }
  const resetRecentQueries = () => {
    recentQueries.value = []
  }

  return {
    // State
    term,
    results,
    recentQueries,
    popularQueries,

    // Loading states
    isLoading,
    isCombinedLoading,
    isRecentLoading,
    isPopularLoading,

    // Cache
    cache,

    // Actions
    fetchSuggestions,
    fetchCombinedQueries,
    fetchRecentQueries,
    fetchPopularQueries,

    // Helpers
    addToRecentQueries,
    removeFromRecentQueries,
    resetRecentQueries,
  }
})
