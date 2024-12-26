import { useCustomFetch } from '~/composables/useCustomFetch'

export const useVerificationService = () => {
    const startVerification = async (phoneNumber, via = 'sms') => {
        try {
            const { data } = await useCustomFetch('/api/verify/start', {
                method: 'POST',
                body: { phoneNumber, via },
            });
            
            return data;
        } catch (error) {
            throw error
        }
    };

    const validateCode = async (phoneNumber, code) => {
        try {
            const { data } = await useCustomFetch('/api/verify/validate', {
                method: 'POST',
                body: { phoneNumber, code },
            });

            return data;
        } catch (error) {
            throw error
        }
    };

    return { startVerification, validateCode };
}