export const useNotifications = () => {

    const client = useSupabaseClient()

    // Insert a new notification into the notifications table
    const insertNotification = async (userId, title, message) => {
        try {
            const { data, error } = await client.from('notifications').insert([{
                user_id: userId,
                title,
                message,
                is_read: false,  // Notifications are unread by default
                created_at: new Date()
            }])

            if (error) throw new Error(error);

            return data;
        } catch (err) {
            throw err;
        }
    };

    // Fetch all notifications for a specific user
    const fetchNotifications = async (userId) => {
        try {
            const { data, error: fetchError } = await client
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (fetchError) throw new Error(fetchError);

            return data;
        } catch (err) {
            throw err;
        }
    };

    // Mark a specific notification as read by its ID
    const markAsRead = async (notificationId) => {
        try {
            const { data, error } = await client
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) throw new Error(error);

            return data;
        } catch (err) {
            throw err;
        }
    };

    // Mark all notifications as read for a specific user
    const markAllAsRead = async (userId) => {
        try {
            const { data, error } = await client
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', userId);

            if (error) throw new Error(error);

            return data;
        } catch (err) {
            throw err;
        }
    };

    // Delete a specific notification by ID
    const deleteNotification = async (notificationId) => {
        try {
            const { data, error } = await client
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) throw new Error(error);

            return data;
        } catch (err) {
            throw err;
        }
    };

    return {
        insertNotification,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    }
}
