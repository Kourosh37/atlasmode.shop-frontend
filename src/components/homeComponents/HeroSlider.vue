<script setup>
// ==============================
// Imports
// ==============================
import { ref, onMounted, nextTick } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useSliderStore } from "../../stores/sliders";

// ==============================
// Store Instance
// ==============================
/**
 * Store for managing slider state and slide data.
 */
const sliderStore = useSliderStore();

/**
 * Controls the fade-in of images for transition animation.
 * @type {import('vue').Ref<boolean>}
 */
const showImages = ref(false);

// ==============================
// Lifecycle
// ==============================
/**
 * On mount:
 * - Fetch slides if not present.
 * - Wait for DOM update, then fade images in after 50ms for animation effect.
 */
onMounted(async () => {
  if (!sliderStore.slides.length) {
    await sliderStore.fetchSlides();
  }
  await nextTick();
  setTimeout(() => {
    showImages.value = true;
  }, 50);
});
</script>

<template>
  <!-- ==============================
       Loading Skeleton
       ============================== -->
  <div v-if="sliderStore.loading || !sliderStore.slides.length">
    <!-- Desktop Skeleton -->
    <div class="hidden md:flex justify-center mx-auto">
      <div class="w-10/12 h-96 rounded-2xl shadow-lg mb-8 bg-gray-200 relative overflow-hidden">
        <div class="absolute inset-0 w-2/3 h-full animate-shine bg-gradient-to-r from-gray-200 via-white to-gray-200"></div>
      </div>
    </div>
    <!-- Mobile Skeleton -->
    <div class="flex md:hidden justify-center mx-auto">
      <div class="w-10/12 h-60 rounded-2xl shadow-lg mb-6 bg-gray-200 relative overflow-hidden">
        <div class="absolute inset-0 w-2/3 h-full animate-shine bg-gradient-to-r from-gray-200 via-white to-gray-200"></div>
      </div>
    </div>
  </div>

  <!-- ==============================
       Sliders (Desktop & Mobile)
       ============================== -->
  <template v-else>
    <!-- Desktop Swiper -->
    <div class="hidden md:flex justify-center mx-auto">
      <Swiper
        :modules="[Pagination, Autoplay]"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 4000 }"
        loop
        class="w-10/12 h-96 rounded-2xl shadow-lg mb-8"
      >
        <SwiperSlide
          v-for="slider in sliderStore.desktopSlides"
          :key="slider.id"
        >
          <Transition name="fade">
            <img
              v-if="showImages"
              :src="slider.image.url"
              :alt="slider.title"
              class="w-full h-full object-cover rounded-2xl"
            />
          </Transition>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Mobile Swiper -->
    <div class="flex md:hidden justify-center mx-auto">
      <Swiper
        :modules="[Pagination, Autoplay]"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 3500 }"
        loop
        class="w-10/12 h-60 rounded-2xl shadow-lg mb-6"
      >
        <SwiperSlide
          v-for="slider in sliderStore.mobileSlides"
          :key="slider.id"
        >
          <Transition name="fade">
            <img
              v-if="showImages"
              :src="slider.image.url"
              :alt="slider.title"
              class="w-full h-full object-cover rounded-2xl"
            />
          </Transition>
        </SwiperSlide>
      </Swiper>
    </div>
  </template>
</template>

<style scoped>
/* ==============================
   Skeleton Loading Animation
   ============================== */
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

/* ==============================
   Fade Animation for Images
   ============================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s cubic-bezier(.4,0,.2,1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
