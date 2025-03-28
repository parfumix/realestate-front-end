// stores/chatStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chatStore', () => {
    // Unified prompts by thread name
    const prompts = ref({
        default: [
            "Apartamente cu 2 dormitoare aproape de centru",
            "Case cu grădină în București",
            "Apartamente moderne în București cu parcare",
            "Proprietăți comerciale de vânzare în București",
            "Proprietăți de închiriat disponibile în București",
        ],
        buyer: [
            "Cât de aproape este de transportul public?",
            "Există școli sau spitale în apropiere?",
            "Care sunt cele mai apropiate centre comerciale?",
            "Care sunt cele mai apropiate parcuri?",
            "Este inclus un loc de parcare?",
        ],
        investor: [
            "Care este randamentul chiriei?",
            "Care a fost rata istorică de apreciere din această zonă?",
            "Care este venitul mediu lunar din chirie?",
            "Cât de stabilă este piața de închiriere din această zonă?",
        ],
    });

    // Messages by thread, where each thread is identified by a unique key (threadId)
    const messages = ref({
        default: [
            {
                text: 'Bună! Cauți o locuință nouă? Asistentul nostru AI este aici să te ajute să găsești exact ce ai nevoie. Scrie preferințele tale și să începem! 🏡✨',
                sender: 'bot',
            },
        ],
    });

    // Loading state for chat queries
    const isQueryLoading = ref(false);

    const handlePushMessage = async(threadId, { text, sender }) => {
        if (!messages.value[threadId]) {
            messages.value[threadId] = [];
        }

        messages.value[threadId].push({ text, sender });
    };

    const handleClearMessages = (threadId) => {
        if (messages.value[threadId]) {
            messages.value[threadId] = [];
        }
    };

    const handleGetMessagesByThread = (threadId) => {
        return messages.value[threadId] || [];
    };

    // Set prompts for a specific thread
    const handleSetPromptsByThread = (threadId, newPrompts) => {
        prompts.value[threadId] = newPrompts;
    };

    // Get prompts for a specific thread
    const handleGetPromptsByThread = (threadId) => {
        return prompts.value[threadId] || [];
    };

    // Return chat-related functionality
    return {
        // Prompts
        prompts,
        handleSetPromptsByThread,
        handleGetPromptsByThread,

        // Messages
        messages,
        handlePushMessage,
        handleClearMessages,
        handleGetMessagesByThread,

        // Loading state
        isQueryLoading,
    };
});