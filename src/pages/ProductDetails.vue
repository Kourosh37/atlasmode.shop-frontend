<template>
  <div dir="rtl">
    <!-- Loading state -->
    <div
      v-if="productStore.loading"
      class="flex flex-col items-center justify-center w-full h-60 bg-white/70 backdrop-blur rounded-2xl p-8"
    >
      <svg
        class="animate-spin h-12 w-12 text-gray-500 drop-shadow-lg mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-30"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span class="text-gray-600 font-semibold text-lg tracking-wide animate-pulse">
        در حال بارگذاری...
      </span>
    </div>

    <!-- Not found state -->
    <div
      v-else-if="productStore.notFound"
      class="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-24 w-24 text-rose-400 mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
        />
      </svg>
      <h2 class="text-3xl font-bold text-rose-500 mb-2">محصول یافت نشد</h2>
      <p class="text-gray-600 text-lg">
        محصول مورد نظر وجود ندارد یا حذف شده است.
      </p>
    </div>

    <!-- Product Detail Content -->
    <div
      v-else
      class="bg-white w-full max-w-6xl mx-auto rounded-2xl shadow-xl p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
    >
      <!-- Product Images Section (right column in desktop) -->
      <div class="order-1 lg:order-1">
        <ProductImages />
      </div>

      <!-- Product Info Section (left column in desktop) -->
      <div class="order-2 lg:order-2 flex flex-col gap-9">
        <ProductInfo @show-size-modal="showSizeModal = true" />
        <ProductSelector />
      </div>
    </div>

    <!-- Size chart modal -->
    <SizeChartModal :show="showSizeModal" @close="showSizeModal = false" />

    <!-- Product Specifications -->
    <ProductSpecifications />
    


    <!-- Related products slider -->
    <ProductSlider
      v-if="productStore.relatedProducts.length > 0 && productStore.relatedProducts !== null"
      title="محصولات مشابه"
      :products="productStore.relatedProducts"
      :loading="productStore.loading"
      link="/products"
    />
  </div>
</template>

<script setup>
/**
 * ProductDetailsPage.vue
 * 
 * Renders the product detail page.
 * Handles loading, not-found and full product states.
 * - Loads product on mount (by id prop)
 * - Shows product gallery, info, selector, size chart modal, related products
 */

import { ref, onMounted } from "vue";
import { useProductStore } from "../stores/productDetails";

// Components
import ProductImages from "../components/productDetailPageComponents/ProductImages.vue";
import ProductInfo from "../components/productDetailPageComponents/ProductInfo.vue";
import ProductSelector from "../components/productDetailPageComponents/ProductSelector.vue";
import SizeChartModal from "../components/productDetailPageComponents/SizeChartModal.vue";
import ProductSlider from "../components/homeComponents/ProductSlider.vue";
import ProductSpecifications from "../components/productDetailPageComponents/ProductSpecifications.vue";

// Props
const props = defineProps(['id']);

// Store
const productStore = useProductStore();
const showSizeModal = ref(false);

// Fetch product on mount
onMounted(async () => {
  await productStore.fetchProduct(props.id);
});
</script>
