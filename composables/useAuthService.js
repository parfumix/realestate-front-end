export const useAuthService = () => {
  const supabase = useSupabaseClient();

  const createAnonymousUser = async () => {
    const anonymousUserId = localStorage.getItem('anonymous_user_id');
    const anonymousAccessToken = localStorage.getItem('anonymous_access_token');

    // Check if anonymous user ID & access token are already stored
    if (anonymousUserId && anonymousAccessToken) {
      return { user: { id: anonymousUserId }, session: { access_token: anonymousAccessToken } };
    }

    // Create a new anonymous user if not created before
    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw new Error(error.message);
      }

      // Store anonymous user session
      localStorage.setItem('anonymous_user_id', data.user.id);
      localStorage.setItem('anonymous_access_token', data.session.access_token);

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

      // Store new user session
      localStorage.setItem('access_token', data.session.access_token);
      localStorage.setItem('real_user_id', data.user.id);

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

      // Store session data
      localStorage.setItem('access_token', data.session.access_token);
      localStorage.setItem('real_user_id', data.user.id);

      return data;
    } catch (error) {
      throw error
    }
  }

  const convertAnonymousToRealUser = async (email) => {
    try {
      const anonymousUserId = localStorage.getItem('anonymous_user_id');
      const anonymousAccessToken = localStorage.getItem('anonymous_access_token');

      if (!anonymousUserId || !anonymousAccessToken) {
        throw new Error('Missing user IDs for conversion')
      }

      const { data, error } = await supabase.auth.updateUser({ email })

      if (error) {
        throw new Error(error.message);
      }

      // Store anonymous user session
      localStorage.setItem('anonymous_user_id', data.user.id);
      localStorage.setItem('anonymous_access_token', data.session.access_token);

      return data;
    } catch (error) {
      throw err;
    }
  }

  return {
    createAnonymousUser,
    registerUser,
    loginUser,
    convertAnonymousToRealUser
  }
}