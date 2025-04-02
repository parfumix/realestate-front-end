import { defineStore } from 'pinia';
import { ref } from 'vue';

import { fetchItems, requestDetails } from '../api/items';
import { removeEmptyValues } from '../utils';

export const useItemsStore = defineStore('itemsStore', () => {
    // Item type constants
    const TYPE_MAP_ITEMS = 'map';
    const TYPE_LIST_ITEMS = 'list';
    const TYPE_LIST_HYBRID = 'hybrid';

    // Loading states
    const isItemsLoaded = ref(false);
    const isQueryLoading = ref(false);
    const isQueryLoadingProperty = ref(false);

    // Items management
    const items = ref([]);
    const mapItems = ref([]);
    const selectedItem = ref(null);
    const hoveredItem = ref(null);
    const latlngs = ref([]);

    // Map refresh state
    const triggeredRefreshMap = ref(false);
    const handleTriggerRefreshMap = (mode = true) => {
        triggeredRefreshMap.value = mode;
    };

    const handleSelectItem = (item) => {
        selectedItem.value = item;
    };

    const handleHoverItem = (item) => {
        hoveredItem.value = item;
    };

    const findItemBySlug = async(slug) => {
        return items.value.find(el => el.slug == slug);
    };

    const handleResetSelectedItem = () => {
        selectedItem.value = null;
    };

    const handleUpdateItem = (itemId, newData) => {
        const index = items.value.findIndex(el => el.id === itemId);
        if (index == -1) return;
        items.value[index] = {...items.value[index], ...newData};

        if(selectedItem.value?.id && selectedItem.value?.id == itemId) {
            selectedItem.value = {...selectedItem.value, ...newData};
        }
    };

    const handleRemoveItem = (itemId) => {
        const index = items.value.findIndex(el => el.id === itemId);
        if (index !== -1) items.value.splice(index, 1);
    };

    const handleResetItems = (type = null) => {
        if(!type) {
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

    const handleSetLatLngs = (newVal) => {
        latlngs.value = newVal
    }

    const handleFetchItems = async (
        q = null, filters = null, mapFilters = null, offset = null, parsequery = null, activeSorting = null
    ) => {
        try {
            isQueryLoading.value = true;

            const viewMode = localStorage.getItem('defaultView') || TYPE_LIST_HYBRID

            const filteredFilters = removeEmptyValues(filters);
            const haveAnyFilters = Object.keys(filteredFilters).length;

            // We might want a separate loading state for map items
            const filteredMapFilters = removeEmptyValues(mapFilters);
            const haveAnyMapFilters = Object.keys(filteredMapFilters).length;

            const { data, error } = await fetchItems(
                q, 
                haveAnyFilters ? filteredFilters : null,
                haveAnyMapFilters ? filteredMapFilters : null,
                offset,
                parsequery,
                activeSorting,
                viewMode
            );
            
            if (error.value) throw new Error(error.value);
            return data.value;
        } catch (err) {
            console.error('Error in handleFetchItems:', err);
            throw err;
        } finally {
            isQueryLoading.value = false;
            isItemsLoaded.value = true;
        }
    };

    const handleRequestDetails = async (uuid, q) => {
        try {
            isQueryLoadingProperty.value = true;
            const { data, error } = await requestDetails(uuid, q);
            if (error.value) throw new Error(error.value);
            return data.value?.data;
        } catch (err) {
            console.error('Error in handleRequestDetails:', err);
            throw err;
        } finally {
            isQueryLoadingProperty.value = false;
        }
    };

    // Return items-related functionality
    return {
        // Constants
        TYPE_MAP_ITEMS,
        TYPE_LIST_ITEMS,
        TYPE_LIST_HYBRID,
        
        // Map refresh
        triggeredRefreshMap,
        handleTriggerRefreshMap,

        // Items
        items,
        mapItems,
        latlngs,
        selectedItem,
        hoveredItem,
        handleUpdateItem,
        handleRemoveItem,
        handleSelectItem,
        handleHoverItem,
        handleResetSelectedItem,
        handleResetItems,
        handlePushItem,
        handlePushItems,
        findItemBySlug,
        handleSetLatLngs,

        // Loading states
        isQueryLoading,
        isItemsLoaded,
        isQueryLoadingProperty,

        // API interactions
        handleFetchItems,
        handleRequestDetails,
    };
});