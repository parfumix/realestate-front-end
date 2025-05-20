<script setup>
const route = useRoute()
const status = ref('loading')
const message = ref('Unsubscribing...')

import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { delay } from '~/utils';
const subscriptionStore = useSubscriptionStore()

onMounted(async () => {
    const token = route.query.token

    if (!token) {
        status.value = 'error'
        message.value = 'Token is missing.'
        return
    }

    await delay(500)

    try {
        await subscriptionStore.unsubscribeByToken(token)

        status.value = 'success'
        message.value = 'You have been successfully unsubscribed.'
    } catch (err) {
        console.log(err)
        status.value = 'error'
        message.value = err.message
    }
})
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div class="max-w-md w-full text-center bg-white rounded-xl shadow p-6">
            <h1 class="text-xl font-bold mb-4">
                {{ status === 'success' ? 'Unsubscribed' : 'Unsubscribe Error' }}
            </h1>
            <p class="text-gray-700">{{ message }}</p>
        </div>
    </div>
</template>
