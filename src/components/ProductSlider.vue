<script setup>
import { ref } from "vue";
import { ChevronRight, ChevronLeft } from 'lucide-vue-next';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

import ProductCard from "../components/ProductCard.vue";
import ProductCardSkeletonLoading from "../components/ProductCardSkeletonLoading.vue";

const props = defineProps({
  title: { type: String, required: true },
  products: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  link: { type: String, default: "#" }
});

const swiperInstance = ref(null);

function onSwiper(swiper) {
  swiperInstance.value = swiper;
}
function slideNext() {
  if (swiperInstance.value) swiperInstance.value.slideNext();
}
function slidePrev() {
  if (swiperInstance.value) swiperInstance.value.slidePrev();
}
</script>

<template>
  <div class="w-full min-h-[560px] bg-gray-50 py-8 flex flex-col items-center gap-8" dir="rtl">
    <div class="container flex justify-between items-center mb-2 px-2 md:px-8">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-700">{{ title }}</h2>
      <a v-if="link" :href="link" class="font-semibold border-b-2 border-gray-800 text-gray-800 hover:text-blue-500 transition">مشاهده بیشتر</a>
    </div>
    <!-- حالت لودینگ -->
    <div v-if="loading" class="container flex gap-6 justify-center overflow-x-auto px-2 md:px-8 py-4">
      <ProductCardSkeletonLoading v-for="i in 4" :key="i" />
    </div>
    <!-- اسلایدر محصولات -->
    <div v-else class="w-full flex items-center justify-center max-w-7xl mx-auto relative">
      <button
        @click="slidePrev"
        class="z-20 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow transition mx-2 absolute right-0 top-1/2 -translate-y-1/2"
        style="flex-shrink:0"
      >
        <ChevronRight class="w-6 h-6" />
      </button>
      <Swiper
        :modules="[Autoplay]"
        :slides-per-view="4"
        :space-between="24"
        :loop="products.length > 4"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        class="group w-full"
        dir="rtl"
        style="padding-bottom: 24px; max-width:calc(4*280px + 3*24px);" 
        @swiper="onSwiper"
        :breakpoints="{
          0: { slidesPerView: 1.2, spaceBetween: 10 },
          480: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 }
        }"
      >
        <SwiperSlide v-for="product in products" :key="product.id" class="flex flex-col items-center">
          <ProductCard :product="product" />
        </SwiperSlide>
      </Swiper>
      <button
        @click="slideNext"
        class="z-20 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow transition mx-2 absolute left-0 top-1/2 -translate-y-1/2"
        style="flex-shrink:0"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>
