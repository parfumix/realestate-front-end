// /composables/useWikimapia.js

import { ref } from 'vue';
import { useCustomFetch } from '~/composables/useCustomFetch';

// Cache object to store responses based on lat, lon, and category
const cache = {};

/**
 * A composable to fetch nearest places from Wikimapia API via the Node.js proxy server with caching.
 * @returns {Object} An object containing the data, loading state, and fetch function.
 */
export function useWikimapia() {
  const places = ref([]);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Fetches the nearest places from the Node.js API.
   * @param {number} lat - Latitude for the search location.
   * @param {number} lon - Longitude for the search location.
   * @param {string} category - Category code for filtering results.
   */
  const fetchNearestPlaces = async (lat, lon, category) => {
    loading.value = true;
    error.value = null;

    // Create a unique cache key based on the parameters
    const cacheKey = `${lat}_${lon}_${category}`;

    // Check if data is already in cache
    if (cache[cacheKey]) {
      places.value = cache[cacheKey];
      loading.value = false;
      return;
    }

    try {
      const { data, error: fetchError } = await useCustomFetch(`/map/nearest`, {
        method: 'POST',
        body: { lat, lon, category },
      });
      if (fetchError) throw fetchError;

      // Store response data in cache
      places.value = data.value || [];
      cache[cacheKey] = places.value; // Cache the result
    } catch (err) {
      console.error("Failed to fetch data:", err);
      error.value = "Unable to fetch data from the server";
    } finally {
      loading.value = false;
    }
  };

  return { places, loading, error, fetchNearestPlaces };
}
