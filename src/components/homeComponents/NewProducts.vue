<script setup>
import { ref, onMounted } from "vue";
import { useNewProductsStore } from "../../stores/newProducts";
import { Heart, Star, ChevronRight, ChevronLeft } from 'lucide-vue-next';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

const store = useNewProductsStore();
const hovered = ref(null);
const loadedImages = ref({});
const swiperInstance = ref(null);

onMounted(() => {
  store.fetchNewProducts();
});

function handleImageLoad(id) {
  loadedImages.value = { ...loadedImages.value, [id]: true };
}

function getProductImage(product, hover = false) {
  if (!product.images?.length) return '';
  if (hover && product.images[1]) return product.images[1].conversions.lg || product.images[1].url;
  return product.images[0].conversions.lg || product.images[0].url;
}

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
      <h2 class="text-2xl md:text-3xl font-bold text-gray-700">جدیدترین محصولات اطلس</h2>
      <a href="#" class="font-semibold border-b-2 border-gray-800 text-gray-800 hover:text-blue-500 transition">مشاهده بیشتر</a>
    </div>

    <div v-if="store.loading" class="container flex gap-6 justify-center overflow-x-auto px-2 md:px-8 py-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl shadow relative flex flex-col items-center min-w-[220px] h-[430px]">
        <div class="w-full h-64 bg-gray-200 animate-shine"></div>
        <div class="px-6 pt-4 w-full">
          <div class="w-24 h-7 bg-gray-200 rounded mb-3 animate-shine"></div>
          <div class="w-16 h-5 bg-gray-200 rounded mb-2 animate-shine"></div>
          <div class="w-24 h-6 bg-gray-200 rounded mb-1 animate-shine"></div>
        </div>
        <div class="flex gap-2 px-6 mt-2 w-full justify-center">
          <div v-for="j in 7" :key="j" class="w-7 h-7 bg-gray-200 rounded-full animate-shine"></div>
        </div>
      </div>
    </div>

    <div v-else class="w-full flex items-center justify-center max-w-7xl mx-auto relative">
      <button @click="slidePrev"
        class="z-20 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow transition mx-2"
        style="flex-shrink:0"
      >
        <ChevronRight class="w-6 h-6" />
      </button>
      <Swiper
        :modules="[Autoplay]"
        :slides-per-view="4"
        :space-between="24"
        :loop="store.products.length > 4"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        class="group w-full"
        dir="rtl"
        style="padding-bottom: 24px; max-width:calc(4*280px + 3*24px);" 
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="product in store.products" :key="product.id" class="flex flex-col items-center">
          <div
            class="relative bg-white rounded-2xl h-[430px] flex flex-col items-center w-full transition-all duration-300 cursor-pointer group overflow-hidden"
            @mouseenter="hovered = product.id"
            @mouseleave="hovered = null"
          >
            <div class="relative w-full h-64 flex items-center justify-center bg-white">
              <div
                v-if="!loadedImages[product.id]"
                class="absolute inset-0 bg-gray-200 animate-shine rounded-2xl"
              ></div>
              <img
                :src="getProductImage(product, hovered === product.id)"
                :alt="product.title"
                class="object-contain w-full h-full rounded-2xl transition-all duration-700"
                :class="{
                  'opacity-0': !loadedImages[product.id],
                  'opacity-100': loadedImages[product.id]
                }"
                @load="handleImageLoad(product.id)"
              />
              <transition name="fade">
                <div
                  v-if="hovered === product.id"
                  class="absolute left-4 top-4 flex flex-col items-center gap-2 z-10"
                >
                  <Star v-for="i in 5" :key="i" class="w-6 h-6 text-gray-400 mb-1 hover:text-yellow-400 cursor-pointer transition" />
                  <Heart class="w-7 h-7 text-gray-500 hover:text-red-400 cursor-pointer transition" />
                </div>
              </transition>
            </div>
            <div class="flex flex-col gap-2 mt-2 w-full px-6">
              <div class="flex gap-2 justify-center my-2">
                <template v-for="color in product.color_ranges" :key="color.id">
                  <span
                    class="w-7 h-7 rounded-full border-2 border-gray-200 inline-block"
                    :style="{ background: `url('${color.image}') center/cover` }"
                    :title="color.title"
                  ></span>
                </template>
              </div>
              <span class="font-bold text-lg text-gray-700 text-center">{{ product.title }}</span>
              <div class="flex items-center justify-center gap-2 mt-1">
                <span
                  v-if="product.discount && product.discount > 0"
                  class="bg-lime-200 text-lime-700 text-xs rounded-full px-2 py-1 font-bold"
                >
                  {{ product.discount }}%
                </span>
                <span
                  class="line-through text-gray-400 text-sm"
                  v-if="(product.major_final_price?.discount_price + product.major_final_price?.amount) > product.price"
                >
                  {{ (product.major_final_price?.discount_price + product.major_final_price?.amount).toLocaleString() }}
                </span>
                <span class="font-bold text-pink-600 text-lg">
                  {{ product.price.toLocaleString() }} تومان
                </span>
              </div>
            </div>
            <transition name="fade">
              <div v-if="hovered === product.id" class="absolute bottom-4 w-full flex justify-center z-10">
                <span class="text-base font-semibold underline text-gray-600">مشاهده بیشتر</span>
              </div>
            </transition>
          </div>
        </SwiperSlide>
      </Swiper>
      <button @click="slideNext"
        class="z-20 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow transition mx-2"
        style="flex-shrink:0"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes shine {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}
.animate-shine {
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 400% 100%;
  animation: shine 1.5s linear infinite;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
