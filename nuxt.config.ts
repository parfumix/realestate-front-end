// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'floating-vue/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    'nuxt-keen-slider',
    'nuxt3-notifications',
    '@nuxtjs/turnstile'
  ],
  runtimeConfig: {
    public: {
      baseURL: `${process.env.API_BASE_URL}` || 'http://localhost:3001',
    },
  },
  ssr: false,
  hooks: {
    'pages:extend'(pages) {
      pages.push({
        name: 'saved',
        path: '/saved',
        file: '~/pages/index.vue', 
        meta: {key: 'saved'}
      });

      pages.push({
        name: 'property',
        path: '/property/:slug',
        file: '~/pages/index.vue', 
        meta: {key: 'index'}
      });

      pages.push({
        name: 'index',
        path: '/',
        file: '~/pages/index.vue', 
        meta: {key: 'index'}
      });
    },
  },
  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY,
  },
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