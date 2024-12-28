import { useCustomFetch } from '~/composables/useCustomFetch'

export const useVerificationService = () => {
    const startVerification = async (phoneNumber, via = 'sms') => {
        try {
            const { data, error } = await useCustomFetch('/verify/start', {
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
            const { data, error } = await useCustomFetch('/verify/validate', {
                method: 'POST',
                body: { phoneNumber, code },
            });

            if(error.value) throw new Error(error.value?.data?.message || 'Please try again later')

            return data;
        } catch (error) {
            throw error
        }
    };

    return { startVerification, validateCode };
}