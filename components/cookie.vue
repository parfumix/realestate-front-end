<template>
    <div id="cookies-simple-with-dismiss-button" class="fixed bottom-0 start-1/2 transform -translate-x-1/2 z-[60] sm:max-w-4xl w-full mx-auto p-6">
  <!-- Card -->
  <div class="p-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
    <div class="flex justify-between items-center gap-x-5 sm:gap-x-10">
      <div class="grow">
        <h2 class="text-sm text-gray-600 dark:text-neutral-400">
          By continuing to use this site you consent to the use of cookies in accordance with our <a class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500" href="#">Cookies Policy.</a>
        </h2>
      </div>
      <button type="button" class="p-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white dark:focus:bg-white/20 dark:focus:text-white" data-hs-remove-element="#cookies-simple-with-dismiss-button">
        <span class="sr-only">Dismiss</span>
        <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
      </button>
    </div>
  </div>
  <!-- End Card -->
</div>
</template>

<script>
  onMounted(() => {
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.querySelectorAll('.hs-overlay').forEach((el) => HSOverlay.open(el));
      });
    });
  })
</script>