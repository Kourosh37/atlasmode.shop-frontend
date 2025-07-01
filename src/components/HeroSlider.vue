<script setup>
import { onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useSliderStore } from "../stores/sliders";

const sliderStore = useSliderStore();

onMounted(() => {
  if (!sliderStore.slides.length) sliderStore.fetchSlides();
});
</script>

<template>

  <!-- Loading -->
  <div v-if="sliderStore.loading || !sliderStore.slides.length">
    <div class="hidden md:flex justify-center mx-auto">
      <div class="w-10/12 h-96 rounded-2xl shadow-lg mb-8 bg-gray-200 relative overflow-hidden">
        <div class="absolute inset-0 w-2/3 h-full animate-shine bg-gradient-to-r from-gray-200 via-white to-gray-200"></div>
      </div>
    </div>
    <div class="flex md:hidden justify-center mx-auto">
      <div class="w-10/12 h-60 rounded-2xl shadow-lg mb-6 bg-gray-200 relative overflow-hidden">
        <div class="absolute inset-0 w-2/3 h-full animate-shine bg-gradient-to-r from-gray-200 via-white to-gray-200"></div>
      </div>
    </div>
  </div>

  <!-- Desktop -->
  <template v-else>
    <div class="hidden md:flex justify-center mx-auto">
      <Swiper
        :modules="[Pagination, Autoplay]"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 4000 }"
        loop
        class="w-10/12 h-96 rounded-2xl shadow-lg mb-8"
      >
        <SwiperSlide v-for="slider in sliderStore.desktopSlides" :key="slider.id">
          <img
            :src="slider.image.url"
            :alt="slider.title"
            class="w-full h-full object-cover rounded-2xl"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Moblie -->
    <div class="flex md:hidden justify-center mx-auto">
      <Swiper
        :modules="[Pagination, Autoplay]"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 3500 }"
        loop
        class="w-10/12 h-60 rounded-2xl shadow-lg mb-6"
      >
        <SwiperSlide v-for="slider in sliderStore.mobileSlides" :key="slider.id">
          <img
            :src="slider.image.url"
            :alt="slider.title"
            class="w-full h-full object-cover rounded-2xl"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </template>
</template>

<style scoped>
@keyframes shine {
  0% {
    transform: translateX(-80%);
  }
  100% {
    transform: translateX(120%);
  }
}
.animate-shine {
  animation: shine 1.5s linear infinite;
}
</style>
