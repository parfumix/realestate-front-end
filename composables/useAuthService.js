export const useAuthService = () => {
  
  const supabase = useSupabaseClient();
  const user = useSupabaseUser()

  const createAnonymousUser = async () => {
    // Check if anonymous user ID & access token are already stored
    if (user.value) {
      return user.value;
    }

    // Create a new anonymous user if not created before
    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  const registerUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error
    }
  }

  const logoutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      throw error
    } finally {
      user.value = null
    }
  }

  const loginUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error
    }
  }

  const convertAnonymousToRealUser = async (email, password) => {
    try {
      if (! user.value) {
        throw new Error('Missing user IDs for conversion')
      }

      const { data, error } = await supabase.auth.updateUser({ email, password })

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  const isUserPendingConfirmation = () => {
    return user.value?.new_email && !user.value?.email;
  }

  const isAuthenticated = () => {
    if (!user.value) return false;
    return user.value?.role == 'authenticated' && user.value?.is_anonymous === false;
  }

  const addPhoneNumber = async (phone_number, verified) => {
    try {
      const { data, error } = await supabase
        .from('phone_numbers')
        .insert({
          user_id: user.value?.id,
          phone_number,
          verified,
        }).select();

      if (error) {
        throw new Error(error.message);
      }

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  const confirmPhoneNumber = async (phoneNumber) => {
    try {
      const { data, error } = await supabase
        .from('phone_numbers')
        .update({ verified: true })
        .eq('user_id', user.value?.id)
        .eq('phone_number', phoneNumber);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  const deletePhoneNumber = async (phoneNumber) => {
    try {
      const { data, error } = await supabase
        .from('phone_numbers')
        .delete()
        .eq('user_id', user.value?.id)
        .eq('phone_number', phoneNumber);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  const fetchPhoneNumbers = async () => {
    try {
      const { data, error } = await supabase
        .from('phone_numbers')
        .select('*')
        .eq('user_id', user.value?.id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  return {
    user,
    isAuthenticated,
    isUserPendingConfirmation,
    createAnonymousUser,
    registerUser,
    logoutUser,
    loginUser,
    convertAnonymousToRealUser,

    fetchPhoneNumbers,
    addPhoneNumber,
    confirmPhoneNumber,
    deletePhoneNumber,
  }
};
