import { useCustomFetch } from '~/composables/useCustomFetch'

export const useAuthService = () => {
  const user = ref(null); // Local user state

  // Function to fetch user from the server using custom fetch
  const fetchUser = async () => {
    try {
      const { data, error } = await useCustomFetch('/user', {
        method: 'GET',
      });

      if (error) throw new Error(error.message);

      user.value = data; // Save user data
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Create an anonymous user (if not authenticated)
  const createAnonymousUser = async () => {
    if (user.value) {
      return user.value; // Return if already authenticated
    }

    try {
      const { data, error } = await useCustomFetch('/auth/anonymous', {
        method: 'POST',
      });

      if (error) {
        throw new Error(error.message);
      }

      // Assuming the response contains the user data and token
      user.value = data.user;

      return data.user;
    } catch (err) {
      throw err;
    }
  };

  // Register a new user
  const registerUser = async (email, password) => {
    try {
      const { data, error } = await useCustomFetch('/auth/register', {
        method: 'POST',
        body: { email, password },
      });

      if (error) {
        throw new Error(error.message);
      }

      user.value = data.user; // Set user data

      return data.user;
    } catch (err) {
      throw err;
    }
  };

  // Login user
  const loginUser = async (email, password) => {
    try {
      const { data, error } = await useCustomFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      if (error) {
        throw new Error(error.message);
      }

      user.value = data.user; // Set user data

      return data.user;
    } catch (err) {
      throw err;
    }
  };

  // Logout user
  const logoutUser = async () => {
    try {
      const { error } = await useCustomFetch('/auth/logout', {
        method: 'POST',
      });

      if (error) {
        throw new Error(error.message);
      }

      // Clear cookie
      user.value = null; // Clear user data
    } catch (err) {
      throw err;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user.value;
  };

  // Fetch user details when service is used
  //fetchUser(); // Fetch the authenticated user based on the token

  return {
    user,
    isAuthenticated,
    createAnonymousUser,
    registerUser,
    logoutUser,
    loginUser,
  };
};
