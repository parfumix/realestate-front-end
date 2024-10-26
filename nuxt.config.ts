// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/leaflet',
    'nuxt-headlessui',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    'nuxt-keen-slider',
    'nuxt3-notifications'
  ],
  runtimeConfig: {
    public: {
      baseURL: `${process.env.API_BASE_URL}` || 'http://localhost:3001',
    },
  },
  ssr: false,
  supabase: {
    // Options
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: [],
      cookieRedirect: false,
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,  // Cookie valid for 8 hours
      sameSite: 'lax',
      secure: true
    }
  },
  headlessui: {
    prefix: 'Headless'
  },
  tailwindcss: {
    configPath: 'tailwind.config',
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})