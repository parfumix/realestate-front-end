import { useCustomFetch } from '~/composables/useCustomFetch';

export const usePropertyService = () => {
    
    const getAllProperties = async () => {
        try {
            const { data, error } = await useCustomFetch('/properties', {
                method: 'GET',
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to fetch properties');

            return data?.value?.data;
        } catch (error) {
            throw error;
        }
    };

    const getPropertyBySlug = async (slug) => {
        try {
            const { data, error } = await useCustomFetch(`/properties/${slug}`, {
                method: 'GET',
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to fetch property');
            return data.value?.data;
        } catch (error) {
            throw error;
        }
    };

    const createProperty = async (property) => {
        try {
            const { data, error } = await useCustomFetch('/properties', {
                method: 'POST',
                body: property,
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to create property');

            return data?.value.data;
        } catch (error) {
            throw error;
        }
    };

    const updateProperty = async (slug, property) => {
        try {
            const { data, error } = await useCustomFetch(`/properties/${slug}`, {
                method: 'PUT',
                body: property,
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to update property');

            return data?.value?.data;
        } catch (error) {
            throw error;
        }
    };

    const deletePropertyBySlug = async (slug) => {
        try {
            const { data, error } = await useCustomFetch(`/properties/${slug}`, {
                method: 'DELETE',
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to delete property');

            return data?.value?.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        getAllProperties,
        getPropertyBySlug,
        createProperty,
        updateProperty,
        deletePropertyBySlug,
    }
}
