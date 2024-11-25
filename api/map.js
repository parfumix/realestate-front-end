import { useCustomFetch } from '~/composables/useCustomFetch'

const fetchNearestPlaces = async (lat, lon, amenity) => {
  const { data, error } = await useCustomFetch(`/map/nearest`, {
    method: 'POST',
    body: JSON.stringify({ lat, lon, amenity }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data, error };
};

export {
    fetchNearestPlaces
}
