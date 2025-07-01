<script setup>
import { onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useSliderStore } from "../stores/sliders";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

const sliderStore = useSliderStore();

onMounted(() => {
  if (!sliderStore.slides.length) sliderStore.fetchSlides();
});
</script>

<template>

  <!-- Loading -->
  <div v-if="sliderStore.loading || !sliderStore.slides.length" class="flex items-center justify-center h-52 w-full">
    <ArrowPathIcon class="w-10 h-10 text-gray-400 animate-spin" />
  </div>
  
  <!-- Desktop -->
  <template v-else>
    <div class="hidden md:block mx-3">
      <Swiper
        :modules="[Pagination, Autoplay]"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 4000 }"
        loop
        class="rounded-2xl shadow-lg mb-8 w-full"
      >
        <SwiperSlide v-for="slider in sliderStore.desktopSlides" :key="slider.id">
          <img
            :src="slider.image.url"
            :alt="slider.title"
            class="w-full h-full rounded-2xl"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Mobile -->
    <div class="block md:hidden mx-3">
      <Swiper
        :modules="[Pagination, Autoplay]"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 3500 }"
        loop
        class="rounded-2xl shadow-lg mb-6 w-full h-48"
      >
        <SwiperSlide v-for="slider in sliderStore.mobileSlides" :key="slider.id">
          <img
            :src="slider.image.url"
            :alt="slider.title"
            class="object-cover w-full h-full rounded-2xl"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </template>
  
</template>
