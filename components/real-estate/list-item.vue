<template>
    <li class="shadow rounded-md">
        <div @click="() => chatStore.handleSelectItem(item)" class="group aspect-h-6 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <img :src="item.images?.[0]" :alt="item.description" class="pointer-events-none object-cover group-hover:opacity-75" />
        </div>
        <div class="px-3 py-2 flex flex-col justify-start">
            <div class="flex justify-betwen">
                <p @click="() => chatStore.handleSelectItem(item)" class="text-sm font-extrabold font-medium text-gray-900 leading-5 pb-2 hover:underline cursor-pointer" :title="item?.title">{{ (item?.title || '').substring(36, item?.title) + '…' }}</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" @click="handleAddToFavorites" stroke-width="1.5" stroke="currentColor" class="size-6 cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
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

const { addFavorite } = useFavoritesService()

const props = defineProps({
    item: {
        type: Object
    }
})

const chatStore = useChatStore()

const openSignInModal = () => {
  modalStore.openModal(SignInModal);
}

const handleAddToFavorites = () => {
    if(user.value?.is_anonymous) return openSignInModal()
    addFavorite(user.value?.id, props.item._additional.id)
}
</script>
