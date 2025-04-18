// stores/auth.js
import { defineStore } from 'pinia'
import { useCustomFetch } from '~/composables/useCustomFetch'
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)
  const token = ref(null)

  const isAuthenticated = computed(() => !!user.value && !user.value.is_anonymous)
  const isAnonymous = computed(() => !!user.value?.is_anonymous)

  const emailPending = computed(() => typeof user.value?.email_verified === 'boolean');
  const emailVerified = computed(() => typeof user.value?.email_verified === 'boolean' && user.value?.email_verified === true)

  // Initialize user from token
  const initializeFromToken = async (tokenValue) => {
    try {
      const decoded = jwtDecode(tokenValue)
      
      setUser(decoded)
      setToken(tokenValue)
    } catch (err) {
      console.warn('Invalid or expired token:', err.message)
      throw err
    }
  }

  // Confirm email
  const confirmEmail = async (token) => {
    try {
      const { data, error } = await useCustomFetch(`/auth/confirm-email/${token}`, {
        method: 'GET',
      })

      if (error.value) throw new Error('Invalid or expired token')
      return data.value
    } catch (err) {
      throw err;
    }
  }

  // Create an anonymous user
  const createAnonymousUser = async () => {
    try {
      const { data, error } = await useCustomFetch('/auth/anonymous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (error.value) throw new Error('Failed to create anonymous user')
      return data.value
    } catch (err) {
      console.error('Anonymous user creation failed', err)
      throw err;
    }
  }

  // Login with email and password
  const login = async (email, password) => {
    try {
      const { data, error } = await useCustomFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include'
      })

      if (error.value) throw new Error('Failed to create anonymous user')
      return data.value
    } catch (err) {
      throw err;
    }
  }

  // Register a new user
  const register = async (email, password) => {
    try {
      const { data, error } = await useCustomFetch('/auth/register', {
        method: 'POST',
        body: { email, password },
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (error.value) throw new Error('Failed to create anonymous user')
      return data.value
    } catch (err) {
      throw err;
    }
  }

  // Logout the user
  const logout = async () => {
    try {
      const { data, error } = await useCustomFetch('/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (error.value) throw new Error('Failed to create anonymous user')
      user.value = null
      return data.value
    } catch (err) {
      console.error('Logout failed', err)
      throw err;
    }
  }

  // Set and get token
  const setToken = (newToken) => {
    token.value = newToken
  }

  // Get token
  const getToken = () => {
    return token.value
  }

  // Set and get user
  const setUser = (newUser) => {
    user.value = newUser
  }

  // Get user
  const getUser = () => {
    return user.value
  }

  return {
    user,
    token,
    setUser,
    setToken,
    getUser,
    getToken,
    isAuthenticated,
    isAnonymous,
    emailVerified,
    emailPending,
    createAnonymousUser,
    initializeFromToken,
    confirmEmail,
    login,
    register,
    logout
  }
})
