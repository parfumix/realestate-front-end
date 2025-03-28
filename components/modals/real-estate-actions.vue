<template>
    <div class="flex justify-between items-center py-2 mr-4">
        <div>
            <p class="text-sm text-gray-700">Publicat pe: {{ formattedDate }}</p>
        </div>
        <div class="flex items-center justify-end space-x-4">
            <span @click="handleTogglFavorite" class="cursor-pointer">
                <svg v-if="! item.is_favorited" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" /></svg>
            </span>
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
            </span>
        </div>
    </div>
</template>

<script setup>
import { format } from 'date-fns'
import { ro } from 'date-fns/locale'

import SignInModal from '@/components/auth-modals/sing-in.vue';
const { isAuthenticated } = useAuthService()

const itemsStore = useItemsStore()

const { selectedItem: item } = storeToRefs(itemsStore)

const modalStore = useModalStore();
const { user } = useAuthService()
const { removeFavorite, addFavorite } = useFavoritesService()

const route = useRoute();
const currentPageType = route.name

const formattedDate = computed(() => {
    return format(new Date(item.value.created_at), "d MMMM yyyy", { locale: ro })
})

const openSignInModal = () => {
  modalStore.openModal(SignInModal);
}

const handleTogglFavorite = async() => {
    if(! isAuthenticated()) {
        openSignInModal()
        return
    }

    const isFavorited = item.value.is_favorited

    if(currentPageType == 'saved') {
        itemsStore.handleTriggerRefreshMap(true)
        itemsStore.handleRemoveItem(item.value.id)
    } else {
        itemsStore.handleUpdateItem(item.value.id, {
            is_favorited: !isFavorited
        })
    }

    return isFavorited
        ? await removeFavorite(item.value.id)
        : await addFavorite(item.value.id);
}
</script>