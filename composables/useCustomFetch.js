export function useCustomFetch(url, options = {}) {
    const config = useRuntimeConfig()

    return useFetch(url, {
      onRequest({ request, options }) {
        options.headers.set('Accept', `application/json`)
      },
      baseURL: config.public.baseURL,
      credentials: 'include',
      ...options,
      $fetch: useNuxtApp().$customFetch
    })
  }
  