export const useFavoritesService = () => {

    const client = useSupabaseClient()

    // Insert a new favorite into the favorites table
    const addFavorite = async (userId, propertyId) => {
        try {
            const { data, error } = await client.from('favorites').insert([{
                user_id: userId,
                property_id: propertyId,
            }])

            if (error) throw new Error(error);

            return data;
        } catch (err) {
            throw err;
        }
    };

    // Remove a favorite from the favorites table
    const removeFavorite = async (userId, propertyId) => {
        try {
            const { data, error } = await client
                .from('favorites')
                .delete()
                .eq('user_id', userId)
                .eq('property_id', propertyId);

            if (error) throw new Error(error);

            return data;
        } catch (err) {
            throw err;
        }
    };

    // Fetch all favorites for a specific user
    const fetchFavorites = async (userId) => {
        try {
            const { data, error: fetchError } = await client
                .from('favorites')
                .select('*')
                .eq('user_id', userId);

            if (fetchError) {
                throw new Error(fetchError);
            }

            return data;
        } catch (err) {
            throw err;
        }
    };

    // Toggle favorite (add if not exists, remove if exists)
    const toggleFavorite = async (userId, propertyId) => {
        try {
            // Check if the property is already a favorite
            const { data: existingFavorite, error } = await client
                .from('favorites')
                .select('*')
                .eq('user_id', userId)
                .eq('property_id', propertyId)
                .single(); // Fetch a single record

            if (existingFavorite) {
                // If favorite exists, remove it
                return await removeFavorite(userId, propertyId);
            } else {
                // If favorite doesn't exist, add it
                return await addFavorite(userId, propertyId);
            }
        } catch (err) {
            throw err;
        }
    };

    return {
        toggleFavorite,
        addFavorite,
        removeFavorite,
        fetchFavorites,
    }
}
