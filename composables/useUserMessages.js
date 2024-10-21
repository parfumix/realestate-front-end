export const useUserMessages = () => {

  const client = useSupabaseClient()

  // Insert a new message into the user_messages table
  const insertMessage = async (userId, propertyId = null, thread, message, role, filters = {}) => {
    try {
      const { data, error } = await client.from('user_messages').insert([{
        user_id: userId,
        property_id: propertyId,
        thread,
        message,
        role,
        meta: {
          filters
        }
      }])

      if (error) throw new Error(error);

      return data;
    } catch (err) {
      throw err
    }
  };

  // Fetch messages for a specific chat thread
  const fetchMessages = async (thread) => {
    try {
      const { data, error: fetchError } = await client
        .from('user_messages')
        .select('*')
        .eq('thread', thread)
        .order('created_at', { ascending: true });

      if (fetchError) throw new Error(fetchError);

      return data;
    } catch (err) {
      throw err
    }
  };

  // Update a specific message by message ID
  const updateMessage = async (messageId, updatedMessage) => {
    try {
      const { data, error } = await client
        .from('user_messages')
        .update({ message: updatedMessage })
        .eq('id', messageId);

      if (error) throw new Error(error);

      return data;
    } catch (err) {
      throw err;
    }
  };

  // Delete a specific message by message ID
  const deleteMessage = async (messageId) => {
    try {
      const { data, error } = await client
        .from('user_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw new Error(error);

      return data;
    } catch (err) {
      throw err;
    }
  };

  // Fetch messages for a user by user ID
  const fetchMessagesByUser = async (userId) => {
    try {
      const { data, error: fetchError } = await client
        .from('user_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (fetchError) throw new Error(fetchError);

      return data;
    } catch (err) {
      throw err;
    }
  };

  // Fetch messages for a specific property by property ID
  const fetchMessagesByProperty = async (propertyId) => {
    try {
      const { data, error: fetchError } = await client
        .from('user_messages')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: true });

      if (fetchError) throw new Error(fetchError);

      return data;
    } catch (err) {
      throw err;
    }
  };

  return {
    insertMessage,
    fetchMessages,
    updateMessage,
    deleteMessage,
    fetchMessagesByUser,
    fetchMessagesByProperty,
  }
}
