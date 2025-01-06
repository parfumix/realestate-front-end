export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    beforeMount(el, binding) {
      // Define the event listener
      el.clickOutsideEvent = (event) => {
        // Check if the click is outside the element
        if (!(el === event.target || el.contains(event.target))) {
          // Call the provided handler
          if (typeof binding.value === 'function') {
            binding.value(event);
          }
        }
      };
      // Attach the event listener to the document
      document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) {
      // Cleanup the event listener
      document.body.removeEventListener('click', el.clickOutsideEvent);
    },
    getSSRProps(binding, vnode) {
      // Provide SSR-specific props (optional, usually empty for this case)
      return {};
    },
  });
});
