<script setup>
import { ref, onMounted } from "vue";
import { usePostsStore } from "../../stores/homeStores/posts";
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

const store = usePostsStore();
const hovered = ref(null);
const swiperInstance = ref(null);

onMounted(() => {
  store.fetchPosts();
});
function onSwiper(swiper) { swiperInstance.value = swiper; }
function slideNext() { if (swiperInstance.value) swiperInstance.value.slideNext(); }
function slidePrev() { if (swiperInstance.value) swiperInstance.value.slidePrev(); }
</script>

<template>
  <div class="w-full min-h-[420px] bg-gray-50 py-8 flex flex-col items-center gap-8" dir="rtl">
    <div class="container flex justify-between items-center mb-2 px-2 md:px-8">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-700">آخرین پست‌های اطلس</h2>
      <a href="#" class="font-semibold border-b-2 border-gray-800 text-gray-800 hover:text-blue-500 transition">مشاهده بیشتر</a>
    </div>
    <div v-if="store.loading" class="container flex gap-6 justify-center overflow-x-auto px-2 md:px-8 py-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-2xl shadow flex flex-col items-center min-w-[220px] h-[220px]">
        <div class="w-full h-40 bg-gray-200 animate-shine rounded-t-2xl"></div>
        <div class="px-6 pt-4 w-full space-y-3">
          <div class="w-28 h-6 bg-gray-200 rounded animate-shine"></div>
        </div>
      </div>
    </div>
    <div v-else class="w-full flex items-center justify-center max-w-7xl mx-auto relative">
      <button @click="slidePrev"
        class="z-20 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow transition mx-2"
        style="flex-shrink:0"
      >
        <ChevronRightIcon class="w-6 h-6" />
      </button>
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
        <SwiperSlide v-for="post in store.posts" :key="post.id" class="flex flex-col items-center">
          <div
            class="relative bg-white rounded-2xl h-[220px] flex flex-col items-center w-full shadow hover:shadow-lg transition group overflow-hidden"
          >
            <div
              class="relative w-full h-32 rounded-t-2xl overflow-hidden"
              @mouseenter="hovered = post.id" @mouseleave="hovered = null"
            >
              <img
                :src="post.image?.url"
                :alt="post.title"
                class="object-cover w-full h-full rounded-t-2xl transition-transform duration-500"
                :class="{ 'scale-110': hovered === post.id }"
                loading="lazy"
              />
            </div>
            <div class="flex items-center justify-between gap-2 w-full px-4 py-2 text-xs">
              <span class="font-bold text-[15px] text-gray-800 truncate">{{ post.title }}</span>
              <span v-if="post.category"
                    class="bg-lime-100 text-lime-700 px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
              >
                {{ post.category.name }}
              </span>
            </div>
            <div class="w-full px-4 pb-3 flex justify-end">
              <span class="text-xs text-gray-400">{{ new Date(post.created_at).toLocaleDateString('fa-IR') }}</span>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <button @click="slideNext"
        class="z-20 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow transition mx-2"
        style="flex-shrink:0"
      >
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style scoped>
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
