<template>
    <div>
        <nav class="flex justify-between items-center border-0 rounded-full px-2">
            <div class="w-3 z-[60] mr-2">
                <svg @click="templateSlidePrev" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-gray-500 cursor-pointer size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <svg  @click="templateSlideNext" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-gray-500 cursor-pointer size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
           
            <slider :slidesPerView="2" ref="templateRef" class="mx-4 w-[450px]" :items="items" v-slot="{ item }">
                <RealEstateSliderItem :item="item" @click="handleShowModal(item)" class="h-[150px] divide-y divide-gray-200 rounded-lg bg-gray-100" />
            </slider>
        </nav>
     
        <ModalsRealEstateProperty :item="currentModalItem" @close="handleCloseModal" class="z-[100]" />
    </div>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array
    }
})

const templateRef = ref(null)

const templateSlideNext = () => {
    return templateRef.value.slideNext()
}
const templateSlidePrev = () => {
    return templateRef.value.slidePrev()
}

const currentModalItem = ref(null)
const handleShowModal = (item) => {
    currentModalItem.value = item
}

const handleCloseModal = () => {
    setTimeout(() => {
        currentModalItem.value = false
    }, 340)
}
</script>
