
import { useCustomFetch } from '~/composables/useCustomFetch';

export const useFavoritesService = () => {

    const addFavorite = async (propertyId) => {
        try {
            const { data, error } = await useCustomFetch(`/listings/favorites/${propertyId}`, {
                method: 'POST'
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to add to favorites');

            return data?.value?.data;
        } catch (error) {
            throw error;
        }
    };

    const removeFavorite = async (propertyId) => {
        try {
            const { data, error } = await useCustomFetch(`/listings/favorites/${propertyId}`, {
                method: 'DELETE'
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to remove from favorites');

            return data?.value?.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        addFavorite,
        removeFavorite,
    }
}
