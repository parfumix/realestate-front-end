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

const requestDetails = async(propertyId, query) => {
  const { data, error } = await useCustomFetch(`request-details/${propertyId}`, {
    method: 'POST',
    body: JSON.stringify({ q: query }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return { data, error }
}

export {
  query, loadMore, requestDetails
}
