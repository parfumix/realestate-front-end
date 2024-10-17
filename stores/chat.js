import { defineStore } from 'pinia';
import { ref } from 'vue';
import { query, loadMore, requestDetails } from '../api/chat';

export const useChatStore = defineStore('chatStore', () => {
    // Messages by thread, where each thread is identified by a unique key (threadId)
    const messages = ref({
        default: [
            {
                text: 'Bună! Cauți o locuință nouă? Asistentul nostru AI este aici să te ajute să găsești exact ce ai nevoie. Scrie preferințele tale și să începem! 🏡✨',
                sender: 'bot',
            },
        ],
    });

    const handlePushMessage = (threadId, message) => {
        if (!messages.value[threadId]) {
            // Initialize a new thread if it doesn't exist
            messages.value[threadId] = [];
        }
        messages.value[threadId].push(message);
    };

    const handleClearMessages = (threadId) => {
        if (messages.value[threadId]) {
            messages.value[threadId] = [];
        }
    };

    const handleGetMessagesByThread = (threadId) => {
        return messages.value[threadId] || [];
    };

    // Prompts
    const prompts = ref([
        "Apartamente cu 2 dormitoare aproape de centru",
        "Case cu grădină în București",
        "Apartamente moderne în București cu parcare",
        "Proprietăți comerciale de vânzare în București",
        "Proprietăți de închiriat disponibile în București",
    ]);

    const promptsProperty = ref({
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

    const handleSetPrompts = (newPrompts) => {
        prompts.value = newPrompts;
    };

    const handleClearPrompts = () => {
        prompts.value = [];
    };

    // Items management
    const items = ref([]);
    const selectedItem = ref(null);

    const handleSelectItem = (item) => {
        selectedItem.value = item;
    };

    const handleResetItem = () => {
        selectedItem.value = null;
    };

    const handleResetItems = () => {
        items.value = [];
    };

    const handlePushItem = (item) => {
        items.value.push(item);
    };

    const handlePushItems = (newItems) => {
        items.value = [...items.value, ...newItems];
    };

    // Loading state
    const isQueryLoading = ref(false);

    // API interactions
    const handleQuery = async (q = null, filters = {}) => {
        try {
            isQueryLoading.value = true;
            const { data, error } = await query(q, filters);
            if (error.value) throw new Error(error.value);
            return data.value;
        } catch (err) {
            console.error('Error in handleQuery:', err);
            throw err;
        } finally {
            isQueryLoading.value = false;
        }
    };

    const handleLoadMore = async () => {
        try {
            const { data, error } = await loadMore();
            if (error.value) throw new Error(error.value);
            return data.value;
        } catch (err) {
            console.error('Error in handleLoadMore:', err);
            throw err;
        }
    };

    const handleRequestDetails = async (q) => {
        try {
            isQueryLoading.value = true;
            const { data, error } = await requestDetails(q);
            if (error.value) throw new Error(error.value);
            return data.value;
        } catch (err) {
            console.error('Error in handleRequestDetails:', err);
            throw err;
        } finally {
            isQueryLoading.value = false;
        }
    };

    // Return grouped by feature
    return {
        // Messages
        messages,
        handlePushMessage,
        handleClearMessages,
        handleGetMessagesByThread,

        // Prompts
        prompts,
        promptsProperty,
        handleSetPrompts,
        handleClearPrompts,

        // Items
        items,
        selectedItem,
        handleSelectItem,
        handleResetItem,
        handleResetItems,
        handlePushItem,
        handlePushItems,

        // Loading state
        isQueryLoading,

        // API interactions
        handleQuery,
        handleLoadMore,
        handleRequestDetails,
    };
});
