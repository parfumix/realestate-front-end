export function useCustomFetch(url, options = {}) {
    const config = useRuntimeConfig()
    const headers = useRequestHeaders(['cookie'])

    return useFetch(url, {
      onRequest({ request, options }) {
        options.headers.set('Accept', `application/json`)
        options.headers.set('Cookie', headers.cookie)
      },
      baseURL: config.public.baseURL,
      credentials: 'include',
      ...options,
      $fetch: useNuxtApp().$customFetch
    })
  }
  