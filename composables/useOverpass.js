// useOverpass.js
import { ref } from 'vue';

export function useOverpass() {
  const amenities = ref([]);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Fetch amenities from Overpass API
   * @param {string} amenityType - Type of amenity to search for
   * @param {number} lat - Latitude of search center
   * @param {number} lng - Longitude of search center
   * @param {number} radius - Search radius in meters
   */
  const fetchAmenities = async (amenityType, lat, lng, radius = 5000) => {
    loading.value = true;
    error.value = null;

    const query = `
      [out:json];
      node
        ["amenity"="${amenityType}"]
        (around:${radius},${lat},${lng});
      out;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      amenities.value = data.elements;
    } catch (err) {
      error.value = err.message;
      amenities.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    amenities,
    loading,
    error,
    fetchAmenities
  };
}
