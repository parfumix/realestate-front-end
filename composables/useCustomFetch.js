export function useCustomFetch(url, options = {}) {
    const config = useRuntimeConfig()

    return useFetch(url, {
      baseURL: config.public.baseURL,
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
      ...options,
      $fetch: useNuxtApp().$customFetch
    })
  }
  