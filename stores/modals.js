import { defineStore } from 'pinia';
import { ref, shallowRef, defineAsyncComponent } from 'vue';

export const useModalStore = defineStore('modalStore', () => {
  // Modal visibility state
  const isModalVisible = ref(false);

  // Store the component to render
  const modalComponent = shallowRef(null);

  // Store the props to pass to the modal
  const modalProps = ref(null);

  // Store success and failure callbacks
  const onSuccess = ref(null);
  const onFailure = ref(null);

  // Open the modal, passing the component, props, and callbacks
  const openModal = (component, props = null, successCallback = null, failureCallback = null) => {
    modalComponent.value = defineAsyncComponent(() => Promise.resolve(component));
    modalProps.value = props;
    onSuccess.value = successCallback;
    onFailure.value = failureCallback;
    isModalVisible.value = true;
  };

  // Trigger the success callback and close the modal
  const success = (result) => {
    if (onSuccess.value) {
      onSuccess.value(result);
    }
    closeModal();
  };

  // Trigger the failure callback and close the modal
  const fail = (error) => {
    if (onFailure.value) {
      onFailure.value(error);
    }
    closeModal();
  };

  // Close the modal and reset state
  const closeModal = () => {
    isModalVisible.value = false;
    modalComponent.value = null;
    modalProps.value = null;
    onSuccess.value = null;
    onFailure.value = null;
  };

  return {
    isModalVisible,
    modalComponent,
    modalProps,
    openModal,
    success,
    fail,
    closeModal,
  };
});
