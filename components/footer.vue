<template>
  <footer class="bg-gray-100 h-[40px]">
    <div class="mx-auto max-w-7xl mx-24 px-6 h-full md:flex items-center md:justify-between lg:px-8">
      <div class="mt-8 md:order-1 md:mt-0">
        <p class="text-center text-xs leading-5 text-gray-500">
          &copy; {{ currentYear }} imai.ro. Toate drepturile sunt rezervate.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>
