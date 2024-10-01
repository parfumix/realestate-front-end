// api/real-estate.js
import { useCustomFetch } from '~/composables/useCustomFetch'

const search = async (query) => {
  const { data, pending, error } = await useCustomFetch(`search?q=${encodeURIComponent(query)}`, {
    method: 'GET',
  });

  return { data, error, pending }
}

export {
  search
}
