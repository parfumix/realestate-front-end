import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationsStore = defineStore('notificationsStore', () => {
    const notifications = ref([])
    const isDrawerVisible = ref(false)

    const handleToggleDrawer = () => {
        isDrawerVisible.value = !isDrawerVisible.value
    }

    const handleCloseDrawer = () => {
        isDrawerVisible.value = false
    }

    return {
        handleToggleDrawer,
        handleCloseDrawer,
        isDrawerVisible,
        notifications
    }
})
