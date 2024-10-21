export const useAuthService = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser()

  const createAnonymousUser = async () => {
    let session = await getSession()

    // Check if anonymous user ID & access token are already stored
    if (session) {
      return session;
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
      let session = await getSession()

      if (! session) {
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

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return session
  }

  return {
    user,
    getSession,
    getUser,
    createAnonymousUser,
    registerUser,
    loginUser,
    convertAnonymousToRealUser
  }
}