import { defineStore } from 'pinia';

export const useLocationStore = defineStore('location', () => {
    const LOCAL_STORAGE_KEY = 'userLocation'
    const location = ref(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '{}'))

    const isLoading = ref(false)

    const setLocationToStorage = (newVal) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
    }

    watch(() => location.value, (newVal) => {
        setLocationToStorage(newVal)
    })

    return {
        setLocationToStorage,
        isLoading,
        location
    }
});
