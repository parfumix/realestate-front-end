import { useCustomFetch } from '~/composables/useCustomFetch'

export async function querySuggestions(term, limit = 15) {
  const { data, error } = await useCustomFetch('/search-queries/autocomplete', {
    query: { term, limit },
  })
  return { data, error }
}

export async function getPopularQueries(limit = 10) {
  const { data, error } = await useCustomFetch('/search-queries/popular', {
    query: { limit },
  })
  return { data, error }
}

export async function getRecentQueries(limit = 10) {
  const { data, error } = await useCustomFetch('/search-queries/recent', {
    query: { limit },
  })
  return { data, error }
}

export async function getCombinedQueries(limit = 10) {
  const { data, error } = await useCustomFetch('/search-queries/queries', {
    query: { limit },
  })
  return { data, error }
}

export const deleteRecentQueries = async () => {
  const { data, error } = await useCustomFetch('/search-queries/recent', {
    method: 'DELETE',
  })
  return { data, error }
}
