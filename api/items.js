import { useCustomFetch } from '~/composables/useCustomFetch'

const fetchItems = async (q = null, filters = null, mapFilters = null, offset = null, parsequery = null, activeSorting = null, viewMode = null) => {
   // Start with the base URL
   let url = 'properties/query';

   // Initialize an array to store query parameters
   const queryParams = [];
 
   // Add parameters only if they are not null
   if (offset !== null) queryParams.push(`offset=${offset}`);

   queryParams.push(`view=${viewMode}`);
 
   // Join the query parameters with '&' if there are any
   if (queryParams.length > 0) {
     url += `?${queryParams.join('&')}`;
   }

  const { data, error } = await useCustomFetch(url, {
    method: 'POST',
    body: JSON.stringify({ q, filters, mapFilters, parsequery, activeSorting: activeSorting ?? null }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data, error };
};

const requestDetails = async(uuid, query) => {
  const { data, error } = await useCustomFetch(`properties/details/${uuid}`, {
    method: 'POST',
    body: JSON.stringify({ q: query }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return { data, error }
}

export {
  fetchItems, requestDetails
}
