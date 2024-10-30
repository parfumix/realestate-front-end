<template>
  <swiper 
    :modules="[Mousewheel, Keyboard, FreeMode]" 
    navigation 
    :pagination="{ clickable: true }" 
    :scrollbar="{ draggable: true }" 
    class="h-full" 
    :slides-per-view="slidesPerView" 
    :space-between="10" 
    @swiper="onSwiper"
  >
    <swiper-slide :class="slideClass" v-for="(item, index) in items" v-slot="{ isActive, isVisible }" :key="index">
      <div class="p-1">
        <slot :item="item" :isActive="isActive" :isVisible="isVisible" :key="index" />
      </div>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Mousewheel, Keyboard, FreeMode } from 'swiper/modules';

import 'swiper/css';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  slideClass: {
    type: String,
    required: false,
  },
  slidesPerView: {
    type: [Number, String],
    default: 2,
  },
})

let swiperInstance = ref(null)
const onSwiper = (swiper) => {
  swiperInstance.value = swiper
}

const slideNext = () => {
  swiperInstance.value?.slideNext()
}
const slidePrev = () => {
  swiperInstance.value?.slidePrev()
}

defineExpose({
  slideNext, slidePrev
})
</script>
