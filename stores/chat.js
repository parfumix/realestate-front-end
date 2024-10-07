import { defineStore } from 'pinia';

export const useChatStore = defineStore('chatStore', () => {
    const messages = ref([])

    const handleSendMessage = (message) => {
        
    }

    return {
        messages
    }
})
