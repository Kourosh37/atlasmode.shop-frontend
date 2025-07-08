<script setup>
import { ref } from "vue";
import { Star, Heart } from 'lucide-vue-next';

const props = defineProps({
  product: { type: Object, required: true },
});

const hovered = ref(false);
const loaded = ref(false);

function handleImageLoad() {
  loaded.value = true;
}

function getProductImage(product, hover = false) {
  if (!product.images?.length) return '';
  if (hover && product.images[1]) return product.images[1].conversions.lg || product.images[1].url;
  return product.images[0].conversions.lg || product.images[0].url;
}
</script>

<template>
  <div
    class="relative bg-white rounded-2xl h-[430px] flex flex-col items-center w-full transition-all duration-300 cursor-pointer group overflow-hidden"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div class="relative w-full h-64 flex items-center justify-center bg-white">
      <div
        v-if="!loaded"
        class="absolute inset-0 bg-gray-200 animate-shine rounded-2xl"
      ></div>
      <img
        :src="getProductImage(product, hovered)"
        :alt="product.title"
        class="object-contain w-full h-full rounded-2xl transition-all duration-700"
        :class="{
          'opacity-0': !loaded,
          'opacity-100': loaded
        }"
        @load="handleImageLoad"
      />
      <!-- ستاره‌ها و قلب فقط روی هاور -->
      <transition name="fade">
        <div
          v-if="hovered"
          class="absolute top-1/2 right-2 -translate-y-1/2 flex flex-col items-center gap-1 z-20"
        >
          <Star v-for="i in 5" :key="i" class="w-4 h-4 text-gray-400 mb-0.5" />
          <Heart class="w-5 h-5 text-gray-500 mt-1" />
        </div>
      </transition>
      <!-- مشاهده بیشتر فقط روی هاور -->
      <transition name="fade">
        <div v-if="hovered" class="absolute bottom-2 w-full flex justify-center z-20">
          <span class="text-base font-semibold underline text-gray-600 bg-white/70 rounded-lg px-2 py-0.5">
            مشاهده بیشتر
          </span>
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
