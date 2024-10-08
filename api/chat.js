// api/real-estate.js
import { useCustomFetch } from '~/composables/useCustomFetch'

const query = async (query) => {
  const { data, error } = await useCustomFetch(`query?q=${encodeURIComponent(query)}`, {
    method: 'GET',
  });

  return { data, error }
}

const loadMore = async() => {
  const { data, error } = await useCustomFetch(`load-more`, {
    method: 'GET',
  });

  return { data, error }
}

export {
  query, loadMore
}
