import { th } from "date-fns/locale"

// middleware to handle authentication
export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return
    const authStore = useAuthStore()

    try {
        const tokenValue = useAuthToken()?.value
        if (! tokenValue) throw new Error('Token not found')
        
        await authStore.initializeFromToken(tokenValue)
    } catch (err) {
        await authStore.createAnonymousUser()
        console.log('Anonymous user created')
    }
  })
