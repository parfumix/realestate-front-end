export const useUserMessages = () => {
  const client = useSupabaseClient()

  // State to hold chat messages
  const messages = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Insert a new message into the user_messages table
  const insertMessage = async (userId, thread, message, role) => {
    try {
      loading.value = true;
      const { data, error: insertError } = await client
        .from('user_messages')
        .insert([
          {
            user_id: userId,
            thread,
            message,
            role,
          },
        ]);

      if (insertError) {
        error.value = insertError.message;
        console.error('Error inserting message:', insertError.message);
        return null;
      }
      
      console.log('Message inserted:', data);
      return data;
    } finally {
      loading.value = false;
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
    loading,
    error,
    insertMessage,
    fetchMessages,
  }
}
