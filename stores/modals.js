import { defineStore } from 'pinia';
import { ref, defineAsyncComponent } from 'vue';

export const useModalStore = defineStore('modalStore', () => {
  // Modal visibility state
  const isModalVisible = ref(false);

  // Store the component to render
  const modalComponent = shallowRef(null);

  // Open the modal and pass the component to be rendered
  const openModal = (component) => {
    modalComponent.value = defineAsyncComponent(() => Promise.resolve(component));
    isModalVisible.value = true;
  };

  // Close the modal
  const closeModal = () => {
    isModalVisible.value = false;
    modalComponent.value = null;
  };

  return {
    isModalVisible,
    modalComponent,
    openModal,
    closeModal,
  };
});
