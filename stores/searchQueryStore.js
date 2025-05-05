import { defineStore } from 'pinia'
import { querySuggestions, getCombinedQueries, getRecentQueries, getPopularQueries } from '~/api/querySuggestions'
import { normalizeQuery } from '~/utils'

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

  // Fetch suggestions based on the input term
  const fetchSuggestions = async (input) => {
    term.value = input
    const normalized = normalizeQuery(input)

    if (normalized.length < 3) {
      results.value = []
      return
    }

    // Check local cache first
    if (cache.value[normalized]) {
      results.value = cache.value[normalized]
      return
    }

    isLoading.value = true

    try {
      const { data } = await querySuggestions(normalized)
      const { data: suggestions } = data?.value || {}

      const mapped = suggestions.map(el => ({...el, ...{type: 'suggestion'}}))

      if (mapped.length) {
        results.value = mapped
        cache.value[normalized] = mapped
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
      const { data } = await getCombinedQueries()
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
  }
})