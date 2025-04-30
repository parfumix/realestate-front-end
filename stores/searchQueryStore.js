import { defineStore } from 'pinia'
import { querySuggestions } from '~/api/querySuggestions'
import { normalizeQuery } from '~/utils'

export const useSearchQueryStore = defineStore('searchQuery', () => {
  const term = ref('')
  const results = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const cache = ref({}) // { normalized_term: [...] }

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
    error.value = null

    const suggestions = await querySuggestions(normalized)

    if (suggestions.length) {
      results.value = suggestions
      cache.value[normalized] = suggestions
    } else {
      error.value = 'No results found'
    }

    isLoading.value = false
  }

  return {
    term,
    results,
    isLoading,
    error,
    cache,
    fetchSuggestions,
  }
})
