<template>
    <li @mouseover="() => handleHoverItem(item.id)" @mouseleave="() => handleHoverItem(null)" class="shadow rounded-md bg-white list-none">
        <div @click="handleSelect" class="group aspect-h-6 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <img :src="item.images?.[0]" :alt="item.description" class="pointer-events-none object-cover group-hover:opacity-75" />
        </div>
        <div class="px-3 py-2 flex flex-col justify-start">
            <div class="flex justify-between">
                <div class="flex-1">
                    <p @click="handleSelect" class="text-sm text-left font-extrabold font-medium text-gray-900 leading-5 pb-2 hover:underline cursor-pointer" :title="item?.title">{{ (item?.title || '').substring(36, item?.title) + '…' }}</p>
                </div>
                <div v-if="!hideBookmark">
                    <svg xmlns="http://www.w3.org/2000/svg" v-if="! item.is_favorited" @click="handleTogglFavorite" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" v-else @click="handleTogglFavorite" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" /></svg>
                </div>
            </div>

            <p class="text-sm font-bold text-gray-900 text-left">{{ $currencyFormat(item.price) }}</p>
            <p class="text-[11px] font-normal text-gray-900 text-left" v-if="item.area && item.price">{{ parseFloat(item?.price / parseFloat(new String(item?.area).match(/\d+(\.\d+)?/))).toFixed(0) }} EUR<span class="text-gray-800"> / m2</span></p>
        </div>

        <!-- Debug Metadata Section -->
        <div class="px-3 py-2 mt-1 bg-gray-100 text-xs border-t border-gray-200" v-if="showDebugInfo">
            <div class="overflow-auto max-h-64">
                <p class="font-semibold text-gray-700 mb-1">Debug Info:</p>
                
                <!-- Property Data -->
                <p><span class="font-medium">ID:</span> {{ item.id }}</p>
                <p><span class="font-medium">Title:</span> {{ item.title }}</p>
                <p><span class="font-medium">Property Type:</span> {{ item.property_type }}</p>
                <p><span class="font-medium">Transaction Type:</span> {{ item.transaction_type }}</p>
                <p><span class="font-medium">Price:</span> {{ item.price }}</p>
                <p><span class="font-medium">Area:</span> {{ item.area }} m²</p>
                <p><span class="font-medium">Floor:</span> {{ item.floor || 'N/A' }}</p>
                <p><span class="font-medium">Rooms:</span> {{ item.room_count || 'N/A' }}</p>
                <p><span class="font-medium">Location:</span> {{ item.location }}</p>
                
                <p class="mt-1 text-right">
                    <button @click="showDebugInfo = false" class="text-blue-600 hover:underline">Hide Debug</button>
                </p>
            </div>
        </div>
        <div v-else class="px-3 py-1">
            <p class="text-right">
                <button @click="showDebugInfo = true" class="text-xs text-gray-500 hover:text-gray-700">Show Debug</button>
            </p>
        </div>
    </li>
</template>

<script setup>
import { useModalStore } from '@/stores/modals';
import SignInModal from '@/components/auth-modals/sing-in.vue';

const modalStore = useModalStore();
const itemsStore = useItemsStore();

const router = useRouter()
const route = useRoute();

const { removeFavorite, addFavorite } = useFavoritesService()
const { user, isAuthenticated } = useAuthService()

const currentPageType = route.name

// Debug info toggle
const showDebugInfo = ref(false);

const props = defineProps({
    item: {
        type: Object
    },
    hideBookmark: {
        type: Boolean,
        default: false
    },
    renderedInMap: {
        type: Boolean,
        default: false
    }
})
let defaultView = ref(
  localStorage.getItem('defaultView') ?? 'list'
)

const openSignInModal = () => {
  modalStore.openModal(SignInModal);
}

const handleSelect = () => {
    router.push({ name: 'property', params: { slug: props.item.slug  } })
}

const handleHoverItem = (item = null) => {
    if( props.renderedInMap || defaultView.value != itemsStore.TYPE_LIST_HYBRID) return
    itemsStore.handleHoverItem(item)
}

const handleTogglFavorite = async() => {
    if(! isAuthenticated()) {
        openSignInModal()
        return
    }

    const isFavorited = props.item.is_favorited

    if(currentPageType == 'saved') {
        itemsStore.handleTriggerRefreshMap(true)
        itemsStore.handleRemoveItem(props.item.id)
    } else {
        itemsStore.handleUpdateItem(props.item.id, {
            is_favorited: !isFavorited
        })
    }

    return isFavorited
        ? await removeFavorite(props.item.id)
        : await addFavorite(props.item.id);
}
</script>
