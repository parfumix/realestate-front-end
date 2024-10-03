<template>
  <swiper :modules="[Mousewheel, Keyboard, FreeMode]" navigation :pagination="{ clickable: true }" :scrollbar="{ draggable: true }" class="h-full" :slides-per-view="props.slidesPerView" :space-between="10" @swiper="onSwiper">
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
  items: [Array, Object],
  slideClass: {
    type: String,
    required: false
  },
  slidesPerView: {
    type: [Number, String],
    default: 2
  },
})

const breakpoints = {
  320: {
    slidesPerView: 1,
  },
  480: {
    slidesPerView: 1,
  },
  768: {
    slidesPerView: 4,
  },
  900: {
    slidesPerView: props.slidesPerView,
  }
}

let swiperIntance = ref(null)
const onSwiper = (swiper) => {
  swiperIntance.value = swiper
}

const slideNext = () => {
  swiperIntance.value.slideNext()
}
const slidePrev = () => {
  swiperIntance.value.slidePrev()
}

defineExpose({
  slideNext, slidePrev
})
</script>
