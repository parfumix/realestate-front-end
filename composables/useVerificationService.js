import { useCustomFetch } from '~/composables/useCustomFetch'

export const useVerificationService = () => {
    
    const startVerification = async (phoneNumber, via = 'sms') => {
        try {
            const { data, error } = await useCustomFetch('/phone/verify', {
                method: 'POST',
                body: { phoneNumber, via },
            });

            if(error.value) throw new Error(error.value?.data?.message || 'Please try again later')
            
            return data;
        } catch (error) {
            throw error
        }
    };

    const validateCode = async (phoneNumber, code) => {
        try {
            const { data, error } = await useCustomFetch('/phone/validate', {
                method: 'POST',
                body: { phoneNumber, code },
            });

            if(error.value) throw new Error(error.value?.data?.message || 'Please try again later')

            return data;
        } catch (error) {
            throw error
        }
    };

    const addPhoneNumber = async (phoneNumber) => {
        try {
            const { data, error } = await useCustomFetch('/phone/add', {
                method: 'POST',
                body: { phoneNumber },
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to add phone number');

            return data.value?.data;
        } catch (error) {
            throw error;
        }
    };

    const deletePhoneNumber = async (phoneNumber) => {
        try {
            const { data, error } = await useCustomFetch('/phone/delete', {
                method: 'DELETE',
                body: { phoneNumber },
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to delete phone number');

            return data.value?.data;
        } catch (error) {
            throw error;
        }
    };

    const fetchPhoneNumbers = async () => {
        try {
            const { data, error } = await useCustomFetch('/phone/fetch', {
                method: 'GET',
            });

            if (error.value) throw new Error(error.value?.data?.message || 'Failed to fetch phone numbers');

            return data.value?.data;
        } catch (error) {
            throw error;
        }
    };

    return { startVerification, validateCode, addPhoneNumber, deletePhoneNumber, fetchPhoneNumbers };
}
