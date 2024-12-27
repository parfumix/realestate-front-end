import { defineStore } from 'pinia';
import { ref, shallowRef, defineAsyncComponent } from 'vue';

export const useModalStore = defineStore('modalStore', () => {
  // Modal visibility state
  const isModalVisible = ref(false);

  // Store the component to render
  const modalComponent = shallowRef(null);

  // Store the arguments to pass to the modal
  const modalProps = ref(null);

  // Open the modal, pass the component to be rendered, and any arguments
  const openModal = (component, props = null) => {
    modalComponent.value = defineAsyncComponent(() => Promise.resolve(component));
    modalProps.value = props;
    isModalVisible.value = true;
  };

  // Close the modal
  const closeModal = () => {
    isModalVisible.value = false;
    modalComponent.value = null;
    modalProps.value = null;
  };

  return {
    isModalVisible,
    modalComponent,
    modalProps,
    openModal,
    closeModal,
  };
});
