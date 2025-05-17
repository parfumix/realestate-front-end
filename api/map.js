import { useCustomFetch } from '~/composables/useCustomFetch'

const fetchNearestPlaces = async (lat, lon, amenity, distance_in_meters = 5000) => {
  const { data, error } = await useCustomFetch(`/listings/map/nearest`, {
    method: 'POST',
    body: JSON.stringify({ lat, lon, amenity, distance_in_meters }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data, error };
};

export {
    fetchNearestPlaces
}
