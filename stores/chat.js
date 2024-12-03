import { defineStore } from 'pinia';
import { ref } from 'vue';
import { query, requestDetails, fetchItemBySlug } from '../api/chat';
import { removeEmptyValues } from '../utils'

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

    const TYPE_MAP_ITEMS = 'map'
    const TYPE_LIST_ITEMS = 'list'
    const TYPE_LIST_HYBRID = 'hybrid'

     // Loading state
     const isQueryLoading = ref(false);
     const isQueryLoadingProperty = ref(false);
 
    // Items management
    const items = ref([]);
    const mapItems = ref([]);

    const triggeredRefreshMap = ref(false)
    const handleTriggerRefreshMap = (mode = true) => {
        triggeredRefreshMap.value = mode
    }

    const selectedItem = ref(null);
    const hoveredItem = ref(null);

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

    const handleSelectItem = (item) => {
        selectedItem.value = item;
    };

    const handleHoverItem = (item) => {
        hoveredItem.value = item;
    };

    const findItemBySlug = async(slug) => {
        let item = items.value.find(el => el.slug == slug)
        if(! item) {
            const { data } = await fetchItemBySlug(slug)
            item = data.value.data
        }

        return item
    }

    const handleResetItem = () => {
        selectedItem.value = null;
    };

    const handleUpdateItem = (itemId, newData) => {
        const index = items.value.findIndex(el => el.id === itemId)
        if (index == -1) return
        items.value[index] = {...items.value[index], ...newData}

        if(selectedItem.value?.id && selectedItem.value?.id == itemId ) {
            selectedItem.value = {...selectedItem.value, ...newData}
        }
    };

    const handleRemoveItem = (itemId) => {
        const index = items.value.findIndex(el => el.id === itemId);
        if (index !== -1) items.value.splice(index, 1);
    };

    const handleResetItems = (type = null) => {
        if(! type) {
            items.value = [];
            mapItems.value = [];
        }

        if(type == TYPE_LIST_ITEMS) items.value = [];
        if(type == TYPE_MAP_ITEMS) mapItems.value = [];
    };

    const handlePushItem = (item, type = TYPE_LIST_ITEMS) => {
        if(type == TYPE_LIST_ITEMS) items.value.push(item);
        if(type == TYPE_MAP_ITEMS) mapItems.value.push(item);
    };

    const handlePushItems = ({ items: newItems = [], mapItems: newMapItems = [] }) => {
        if(newItems.length) items.value = [...items.value, ...newItems];
        if(newMapItems.length) mapItems.value = [...mapItems.value, ...newMapItems];
    };

    // API interactions
    const handleQuery = async (q = null, filters = null, mapFilters = null, offset = null, isMovingMap = null) => {
        try {
            isQueryLoading.value = true;

            const filteredFilters = removeEmptyValues(filters)
            const filteredMapFilters = removeEmptyValues(mapFilters)

            const haveAnyFilters = Object.keys(filteredFilters).length
            const haveAnyMapFilters = Object.keys(filteredMapFilters).length

            const { data, error } = await query(
                q, 
                haveAnyFilters ? filteredFilters : null,
                haveAnyMapFilters ? filteredMapFilters : null,
                
                offset,
                isMovingMap
            );
            if (error.value) throw new Error(error.value);
            return data.value;
        } catch (err) {
            console.error('Error in handleQuery:', err);
            throw err;
        } finally {
            isQueryLoading.value = false;
        }
    };

    const handleRequestDetails = async (propertyId, q) => {
        try {
            isQueryLoadingProperty.value = true;
            const { data, error } = await requestDetails(propertyId, q);
            if (error.value) throw new Error(error.value);
            return data.value?.data;
        } catch (err) {
            console.error('Error in handleRequestDetails:', err);
            throw err;
        } finally {
            isQueryLoadingProperty.value = false;
        }
    };

    // Return grouped by feature
    return {
        triggeredRefreshMap, 
        handleTriggerRefreshMap,

        // Prompts
        prompts,
        handleSetPromptsByThread,
        handleGetPromptsByThread,

        // Messages
        messages,
        handlePushMessage,
        handleClearMessages,
        handleGetMessagesByThread,

        TYPE_MAP_ITEMS,
        TYPE_LIST_ITEMS,
        TYPE_LIST_HYBRID,
        
        // Items
        items,
        mapItems,
        selectedItem,
        hoveredItem,
        handleUpdateItem,
        handleRemoveItem,
        handleSelectItem,
        handleHoverItem,
        handleResetItem,
        handleResetItems,
        handlePushItem,
        handlePushItems,

        // Loading state
        isQueryLoading,
        isQueryLoadingProperty,

        // API interactions
        handleQuery,
        handleRequestDetails,

        findItemBySlug
    };
})
