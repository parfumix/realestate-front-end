import { useCustomFetch } from '~/composables/useCustomFetch'

const query = async (q = null, filters = null, mapFilters = null, offset = 0) => {
  const { data, error } = await useCustomFetch(`query?offset=${offset}`, {
    method: 'POST',
    body: JSON.stringify({ q, filters, mapFilters }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data, error };
};

const requestDetails = async(propertyId, query) => {
  const { data, error } = await useCustomFetch(`details/${propertyId}`, {
    method: 'POST',
    body: JSON.stringify({ q: query }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return { data, error }
}

export {
  query, requestDetails
}
