import { useCustomFetch } from '~/composables/useCustomFetch';

export const usePropertyService = () => {
    
    const getAllProperties = async () => {
        try {
            const { data, error } = await useCustomFetch('/listings', {
                method: 'GET',
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to fetch properties');

            return data?.value?.data;
        } catch (error) {
            throw error;
        }
    };

    const getPropertyById = async (id) => {
        try {
            const { data, error } = await useCustomFetch(`/listings/${id}`, {
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
            const { data, error } = await useCustomFetch('/listings', {
                method: 'POST',
                body: property,
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to create property');

            return data?.value.data;
        } catch (error) {
            throw error;
        }
    };

    const updateProperty = async (uuid, property) => {
        try {
            const { data, error } = await useCustomFetch(`/listings/${uuid}`, {
                method: 'PUT',
                body: property,
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to update property');

            return data?.value?.data;
        } catch (error) {
            throw error;
        }
    };

    const deletePropertyById = async (id) => {
        try {
            const { data, error } = await useCustomFetch(`/listings/${id}`, {
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
        getPropertyById,
        createProperty,
        updateProperty,
        deletePropertyById,
    }
}
