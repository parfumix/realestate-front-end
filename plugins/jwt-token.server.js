// plugins/init-auth.server.js
export default defineNuxtPlugin((nuxtApp) => {
    const token = useCookie('token', { httpOnly: true }).value ?? null
    useState('auth-token', () => token ?? null)
})
  