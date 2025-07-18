<script setup>
/**
 * ProductCard.vue
 * Reusable product card for grid/list display. All interactive states are handled inside.
 * Props: product (Object, required) - expected shape: { images, title, price, discount, color_ranges, ... }
 * Emits: 'click' (when card is clicked)
 * Features:
 *   - Hover states (show action icons, alt image, highlight)
 *   - Responsive icon sizes
 *   - Loading skeleton for image
 *   - Dynamic color thumbnails
 *   - Animated transitions (fade for icons/details)
 */

import { ref, onMounted, onBeforeUnmount } from "vue";
import { Star, Heart } from 'lucide-vue-next';

// ==============================
// Props
// ==============================
const props = defineProps({
  product: { type: Object, required: true },
});

// ==============================
// Reactive State
// ==============================
const hovered = ref(false);      // Card is hovered (desktop)
const loaded = ref(false);       // Product image loaded
const cardRef = ref(null);       // Ref for measuring width

const starSize = ref(9);         // px, responsive
const heartSize = ref(12);

// ==============================
// Icon Sizing - Responsive on Card Resize
// ==============================
function updateIconSize() {
  if (cardRef.value) {
    const w = cardRef.value.offsetWidth;
    // Dynamic sizing: 7.5% for star, 9% for heart, with min/max caps
    starSize.value = Math.max(9, Math.min(18, Math.round(w * 0.075)));
    heartSize.value = Math.max(11, Math.min(22, Math.round(w * 0.09)));
  }
}

onMounted(() => {
  updateIconSize();
  window.addEventListener('resize', updateIconSize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIconSize);
});

// ==============================
// Image Handling
// ==============================
function handleImageLoad() {
  loaded.value = true;
}

/**
 * Returns product image url.
 * Shows second image (if present) on hover.
 * @param {object} product
 * @param {boolean} hover
 * @returns {string}
 */
function getProductImage(product, hover = false) {
  if (!product.images?.length) return '';
  if (hover && product.images[1]) return product.images[1].conversions.lg || product.images[1].url;
  return product.images[0].conversions.lg || product.images[0].url;
}
</script>

<template>
  <!-- ==============================
       Product Card (Hoverable, Clickable)
       ============================== -->
  <div
    ref="cardRef"
    class="relative bg-white rounded-2xl w-full aspect-[3/4] flex flex-col p-6 transition-all duration-300 cursor-pointer group overflow-hidden shadow-2xl"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="$emit('click')"
  >
    <!-- ===== Stars and Heart: appear on hover (top-right) ===== -->
    <transition name="fade">
      <div
        v-if="hovered"
        class="absolute top-3 right-3 flex flex-col items-center gap-0.5 z-30"
      >
        <!-- 5 Stars (grey, static) -->
        <Star v-for="i in 5" :key="i"
          class="text-gray-400"
          :style="{ width: starSize + 'px', height: starSize + 'px' }"
        />
        <!-- Heart icon -->
        <Heart
          class="mt-1 text-gray-500"
          :style="{ width: heartSize + 'px', height: heartSize + 'px' }"
        />
      </div>
    </transition>

    <!-- ===== Product Image (with skeleton) ===== -->
    <div class="relative w-full aspect-[3/4] flex items-center justify-center bg-white overflow-hidden rounded-2xl mb-2">
      <!-- Skeleton loading animation -->
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
      <!-- See More on hover -->
      <transition name="fade">
        <div v-if="hovered" class="absolute bottom-2 w-full flex justify-center z-20">
          <span class="text-base font-semibold text-gray-600 bg-white/80 rounded-lg px-3 py-1 shadow-sm">
            مشاهده بیشتر
          </span>
        </div>
      </transition>
    </div>

    <!-- ===== Product Details ===== -->
    <div class="flex flex-col gap-2 mt-2 w-full px-1 flex-1">
      <!-- Color Swatches -->
      <div class="flex gap-2 justify-center my-1">
        <template v-for="color in product.color_ranges" :key="color.id">
          <span
            class="w-6 h-6 rounded-full border-2 border-gray-200 inline-block"
            :style="{ background: `url('${color.image}') center/cover` }"
            :title="color.title"
          ></span>
        </template>
      </div>
      <!-- Product Title -->
      <span class="font-bold text-sm text-gray-700 text-center truncate">{{ product.title }}</span>
      <!-- Pricing & Discount -->
      <div class="flex items-center justify-center gap-2 mt-1">
        <span
          v-if="product.discount && product.discount > 0"
          class="bg-lime-200 text-lime-700 text-xs rounded-full px-2 py-1 font-bold"
        >
          {{ product.discount }}%
        </span>
        <span
          class="line-through text-gray-400 text-xs"
          v-if="(product.major_final_price?.discount_price + product.major_final_price?.amount) > product.price"
        >
          {{ (product.major_final_price?.discount_price + product.major_final_price?.amount).toLocaleString() }}
        </span>
        <span class="font-bold text-pink-600 text-base">
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
