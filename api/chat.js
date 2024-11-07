import { useCustomFetch } from '~/composables/useCustomFetch'

const query = async (query = null, filters = {}, offset = 0) => {
  const { data, error } = await useCustomFetch(`query?offset=${offset}`, {
    method: 'POST',
    body: JSON.stringify({ q: query, filters }),
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
