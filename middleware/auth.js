export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // Allow access to the register page and any other excluded pages
  const publicPages = ['/register', '/login']

  // If the user is not authenticated and trying to access a protected page
  if (!user.value && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }
})
