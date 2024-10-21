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
      throw err;
    }
  }

  return {
    user,
    createAnonymousUser,
    registerUser,
    loginUser,
    convertAnonymousToRealUser
  }
}