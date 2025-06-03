import { useCustomFetch } from '~/composables/useCustomFetch'

export const fetchItems = async (
  q = null,
  filters = null,
  mapFilters = null,
  offset = null,
  parsequery = null,
  activeSorting = null,
  viewMode = null,
) => {
  // Start with the base URL
  let url = 'listings/query'

  // Initialize an array to store query parameters
  const queryParams = []

  // Add parameters only if they are not null
  if (offset !== null) queryParams.push(`offset=${offset}`)

  queryParams.push(`view=${viewMode}`)

  // Join the query parameters with '&' if there are any
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`
  }

  const { data, error } = await useCustomFetch(url, {
    method: 'POST',
    body: JSON.stringify({ q, filters, mapFilters, parsequery, activeSorting }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return { data, error }
}

export const fetchItemBySlug = async (slug) => {
  const { data, error } = await useCustomFetch(`listings/i/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return { data, error }
}

export const getNearbyPlaces = async (uuid, queryParams) => {
  const { data, error } = await useCustomFetch(`listings/nearby-places/${uuid}`, {
    method: 'GET',
    query: queryParams,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return { data, error }
}
