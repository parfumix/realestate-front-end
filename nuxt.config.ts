// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'floating-vue/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    '@pinia/nuxt',
    'nuxt-keen-slider',
    'nuxt3-notifications',
    '@nuxtjs/turnstile'
  ],
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    public: {
      baseURL: `${process.env.API_BASE_URL}` || 'http://localhost:3001',
    },
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  ssr: true,
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
  headlessui: {
    prefix: 'Headless'
  },
  tailwindcss: {
    configPath: 'tailwind.config',
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})