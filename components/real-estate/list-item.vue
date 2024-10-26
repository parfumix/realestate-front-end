<template>
    <li class="shadow rounded-md">
        <div @click="() => chatStore.handleSelectItem(item)" class="group aspect-h-6 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <img :src="item.meta.images?.[0]" :alt="item.meta.description" class="pointer-events-none object-cover group-hover:opacity-75" />
        </div>
        <div class="px-3 py-2 flex flex-col justify-start">
            <div class="flex justify-between">
                <div class="flex-1">
                    <p @click="() => chatStore.handleSelectItem(item)" class="text-sm font-extrabold font-medium text-gray-900 leading-5 pb-2 hover:underline cursor-pointer" :title="item?.title">{{ (item?.title || '').substring(36, item?.title) + '…' }}</p>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" v-if="! item.is_favorited" @click="handleTogglFavorite" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" v-else @click="handleTogglFavorite" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" /></svg>
                </div>
            </div>

            <p class="text-sm font-bold text-gray-900">{{ $currencyFormat(item.price, 'fr-FR', 'EUR') }}</p>
            <p class="text-[11px] font-normal text-gray-900" v-if="item.area && item.price">{{ parseFloat(item?.price / parseFloat(new String(item?.area).match(/\d+(\.\d+)?/))).toFixed(0) }} EUR<span class="text-gray-800"> / m2</span></p>
        </div>
    </li>
</template>

<script setup>
import { useModalStore } from '@/stores/modals';
import SignInModal from '@/components/auth-modals/sing-in.vue';

const { user } = useAuthService()
const modalStore = useModalStore();
const chatStore = useChatStore();

const { toggleFavorite } = useFavoritesService()
const { isAuthenticated } = useAuthService()

const props = defineProps({
    item: {
        type: Object
    }
})

const openSignInModal = () => {
  modalStore.openModal(SignInModal);
}

const handleTogglFavorite = async() => {
    if(! isAuthenticated()) {
        openSignInModal()
        return
    }

    // modify object locally
    chatStore.handleUpdateItem(props.item.id, {
        is_favorited: !props.item.is_favorited
    })

    await toggleFavorite(user.value?.id, props.item.id)
}
</script>
