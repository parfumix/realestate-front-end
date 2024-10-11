// api/real-estate.js
import { useCustomFetch } from '~/composables/useCustomFetch'

const query = async (query = null, filters = {}) => {
  const { data, error } = await useCustomFetch('query', {
    method: 'POST',
    body: JSON.stringify({ q: query, filters }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data, error };
};

const loadMore = async() => {
  const { data, error } = await useCustomFetch(`load-more`, {
    method: 'GET',
  });

  return { data, error }
}

export {
  query, loadMore
}
