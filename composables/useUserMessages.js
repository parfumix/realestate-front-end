export const useUserMessages = () => {

  const client = useSupabaseClient()

  // State to hold chat messages
  const messages = ref([]);

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
        }
      ])

      if (error) throw new Error(error);
      
      return data;
    } catch(err) {
      throw err
    }
  };

  // Fetch messages for a specific chat thread
  const fetchMessages = async (thread) => {
    try {
      loading.value = true;
      const { data, error: fetchError } = await client
        .from('user_messages')
        .select('*')
        .eq('thread', thread)
        .order('created_at', { ascending: true });

      if (fetchError) {
        error.value = fetchError.message;
        console.error('Error fetching messages:', fetchError.message);
        return [];
      }
      
      messages.value = data;
      return data;
    } finally {
      loading.value = false;
    }
  };

  return {
    messages,
    insertMessage,
    fetchMessages,
  }
}
