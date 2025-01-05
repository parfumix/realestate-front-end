import { useCustomFetch } from '~/composables/useCustomFetch';

export const useMessagesService = () => {
    
    const sendMessage = async (propertyId = null, thread, message, role, filters = {}) => {
        try {
            const { data, error } = await useCustomFetch('/messages', {
                method: 'POST',
                body: {
                    propertyId,
                    thread,
                    message,
                    role,
                    filters
                }
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to insert message');

            return data?.value?.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        sendMessage,
    }
}