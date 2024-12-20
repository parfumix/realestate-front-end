import { useCustomFetch } from '~/composables/useCustomFetch'

const query = async (q = null, filters = null, mapFilters = null, offset = null, isMovingMap = null) => {
   // Start with the base URL
   let url = 'query';

   // Initialize an array to store query parameters
   const queryParams = [];
 
   // Add parameters only if they are not null
   if (offset !== null) queryParams.push(`offset=${offset}`);
   if (isMovingMap !== null) queryParams.push(`moving_map=${isMovingMap}`);
 
   // Join the query parameters with '&' if there are any
   if (queryParams.length > 0) {
     url += `?${queryParams.join('&')}`;
   }

  const { data, error } = await useCustomFetch(url, {
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

const fetchItemBySlug = async(slug) => {
  const { data, error } = await useCustomFetch(`property/${slug}`);
  return { data, error }
}

export {
  query, requestDetails, fetchItemBySlug
}
