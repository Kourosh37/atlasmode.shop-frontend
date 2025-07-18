<script setup>
// ==============================
// Imports
// ==============================
import { ref, onMounted } from "vue";
import { usePostsStore } from "../../stores/posts";
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

// ==============================
// Store & States
// ==============================
/**
 * Store instance to handle blog posts data.
 */
const store = usePostsStore();

/**
 * ID of the post currently hovered (for image zoom effect).
 * @type {import('vue').Ref<number|null>}
 */
const hovered = ref(null);

/**
 * Reference to the Swiper instance, to control slide navigation.
 * @type {import('vue').Ref<any>}
 */
const swiperInstance = ref(null);

// ==============================
// Lifecycle
// ==============================
/**
 * On component mount, fetch the latest posts.
 */
onMounted(() => {
  store.fetchPosts();
});

// ==============================
// Methods
// ==============================
/**
 * Handler for Swiper instance creation.
 * @param {any} swiper - The Swiper instance object.
 */
function onSwiper(swiper) {
  swiperInstance.value = swiper;
}

/**
 * Navigate to the next slide.
 */
function slideNext() {
  if (swiperInstance.value) swiperInstance.value.slideNext();
}

/**
 * Navigate to the previous slide.
 */
function slidePrev() {
  if (swiperInstance.value) swiperInstance.value.slidePrev();
}
</script>

<template>
  <div class="w-full min-h-[420px] bg-gray-50 py-8 flex flex-col items-center gap-8" dir="rtl">
    <!-- ==============================
         Header: Title & See More Link
         ============================== -->
    <div class="container flex justify-between items-center mb-2 px-2 md:px-8">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-700">آخرین پست‌های اطلس</h2>
      <a href="#" class="font-semibold border-b-2 border-gray-800 text-gray-800 hover:text-blue-500 transition">
        مشاهده بیشتر
      </a>
    </div>

    <!-- ==============================
         Loading State: Post Skeletons
         ============================== -->
    <div
      v-if="store.loading"
      class="container flex gap-6 justify-center overflow-x-auto px-2 md:px-8 py-4"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white rounded-2xl shadow flex flex-col items-center min-w-[220px] h-[220px]"
      >
        <div class="w-full h-40 bg-gray-200 animate-shine rounded-t-2xl"></div>
        <div class="px-6 pt-4 w-full space-y-3">
          <div class="w-28 h-6 bg-gray-200 rounded animate-shine"></div>
        </div>
      </div>
    </div>

    <!-- ==============================
         Posts Swiper (Loaded State)
         ============================== -->
    <div
      v-else
      class="w-full flex items-center justify-center max-w-7xl mx-auto relative"
    >
      <!-- Prev Button -->
      <button
        @click="slidePrev"
        class="z-20 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow transition mx-2"
        style="flex-shrink:0"
        aria-label="Previous"
      >
        <ChevronRightIcon class="w-6 h-6" />
      </button>

      <!-- Swiper Component -->
      <Swiper
        :modules="[Autoplay]"
        :slides-per-view="4"
        :space-between="24"
        :loop="store.posts.length > 4"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :breakpoints="{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 }
        }"
        class="group w-full"
        dir="rtl"
        style="padding-bottom: 24px; max-width:calc(4*260px + 3*24px);"
        @swiper="onSwiper"
      >
        <SwiperSlide
          v-for="post in store.posts"
          :key="post.id"
          class="flex flex-col items-center"
        >
          <div
            class="relative bg-white rounded-2xl h-[220px] flex flex-col items-center w-full shadow hover:shadow-lg transition group overflow-hidden"
          >
            <!-- Post Image (Zoom on Hover) -->
            <div
              class="relative w-full h-32 rounded-t-2xl overflow-hidden"
              @mouseenter="hovered = post.id"
              @mouseleave="hovered = null"
            >
              <img
                :src="post.image?.url"
                :alt="post.title"
                class="object-cover w-full h-full rounded-t-2xl transition-transform duration-500"
                :class="{ 'scale-110': hovered === post.id }"
                loading="lazy"
              />
            </div>
            <!-- Post Title and Category -->
            <div class="flex items-center justify-between gap-2 w-full px-4 py-2 text-xs">
              <span class="font-bold text-[15px] text-gray-800 truncate">{{ post.title }}</span>
              <span
                v-if="post.category"
                class="bg-lime-100 text-lime-700 px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
              >
                {{ post.category.name }}
              </span>
            </div>
            <!-- Post Date (Jalali, fa-IR) -->
            <div class="w-full px-4 pb-3 flex justify-end">
              <span class="text-xs text-gray-400">
                {{ new Date(post.created_at).toLocaleDateString('fa-IR') }}
              </span>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Next Button -->
      <button
        @click="slideNext"
        class="z-20 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow transition mx-2"
        style="flex-shrink:0"
        aria-label="Next"
      >
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ==============================
   Loading Skeleton Animation
   ============================== */
@keyframes shine {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
.animate-shine {
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 400% 100%;
  animation: shine 1.5s linear infinite;
}
</style>
