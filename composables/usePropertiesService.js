// /composables/usePropertiesService.js
export const usePropertiesService = () => {

    const client = useSupabaseClient()

    // Insert a new property into the properties table
    const insertProperty = async (property) => {
        try {
            const { data, error } = await client.from('properties').insert([{
                ...property,  // Spread the incoming property object to insert all its fields
                created_at: new Date(),  // Ensure created_at is set
                updated_at: new Date(),  // Set updated_at when inserting
            }])

            if (error) throw new Error(error);

            return data;
        } catch (err) {
            throw err;
        }
    };

    // Fetch a specific property by its ID
    const fetchPropertyById = async (propertyId) => {
        try {
            const { data, error } = await client
                .from('properties')
                .select('*')
                .eq('id', propertyId)
                .single();

            if (error) throw new Error(error);

            return data;
        } catch (err) {
            throw err;
        }
    };

    // Update a property by its ID
    const updateProperty = async (propertyId, updatedProperty) => {
        try {
            const { data, error } = await client
                .from('properties')
                .update({
                    ...updatedProperty,
                    updated_at: new Date(),  // Update the updated_at timestamp
                })
                .eq('id', propertyId);

            if (error) throw new Error(error);

            return data;
        } catch (err) {
            throw err;
        }
    };

    // Delete a property by its ID
    const deleteProperty = async (propertyId) => {
        try {
            const { data, error } = await client
                .from('properties')
                .delete()
                .eq('id', propertyId);

            if (error) throw new Error(error);

            return data;
        } catch (err) {
            throw err;
        }
    };

    // Fetch all properties and join with favorites table for a specific user
    const fetchProperties = async (userId) => {
        try {
            const { data } = await useAsyncData('restaurant', async () => {
                const { data, error } = await client
                    .from('properties')
                    .select(`
                    *,
                    favorites:favorites (property_id, added_at)  -- join with the favorites table
                `)
                    .eq('favorites.user_id', userId)  // Only fetch favorites for the given user
                    .order('created_at', { ascending: false });

                if (error) throw new Error(error);

                // Mark whether the property is a favorite for this user
                const propertiesWithFavorites = data.map(property => ({
                    ...property,
                    is_favorite: property.favorites.length > 0,
                    favorite_added_at: property.favorites.length > 0 ? property.favorites[0].added_at : null,
                }));

                return propertiesWithFavorites
            })

            return data;
        } catch (err) {
            throw err;
        }
    };

     // Fetch properties by an array of UUIDs and search by internal_id
     const fetchPropertiesByUuids = async (uuids) => {
        try {
            const { data, error } = await client
                .from('properties')
                .select('*')
                .in('internal_id', uuids);  // Search for matching internal_id in the array of UUIDs

            if (error) throw new Error(error);

            return data;
        } catch (err) {
            throw err;
        }
    };

    return {
        insertProperty,
        fetchProperties,
        fetchPropertiesByUuids,
        fetchPropertyById,
        updateProperty,
        deleteProperty,
    }
}
