export function useCustomFetch(url, options = {}) {
    const config = useRuntimeConfig()
    const session = useSupabaseSession()

    return useFetch(url, {
      onRequest({ request, options }) {
        options.headers.set('Accept', `application/json`)
        options.headers.set('Authorization', `Bearer ${session.value?.access_token}`)
      },
      baseURL: config.public.baseURL,
      credentials: 'include',
      ...options,
      $fetch: useNuxtApp().$customFetch
    })
  }
  