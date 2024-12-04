<script setup>
import { clearError } from '#app'

// Props to receive the error object
const props = defineProps({
  error: Object
})

// Function to handle error clearing
const handleClearError = () => {
  clearError({ redirect: '/' }) // Redirect to the homepage after clearing the error
}
</script>

<template>
  <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <p class="text-base font-semibold text-blue-600">{{ error.statusCode || 'Error' }}</p>
      <h1 class="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
        {{ error.statusMessage || error.message || 'Something went wrong' }}
      </h1>
      <p v-if="error.description" class="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
        {{ error.description }}
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <button
          @click="handleClearError"
          class="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Go back home
        </button>
      </div>
    </div>
  </main>
</template>
