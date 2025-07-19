<template>
  <div class="flex flex-col gap-4">

    <!-- ==============================
         Product Categories
         ============================== -->
    <div class="flex flex-wrap items-center gap-2 text-sm text-gray-500 font-medium">
      <span>لباس زنانه، شلوارک و شورتک زنانه</span>
    </div>

    <!-- ==============================
         Product Title
         ============================== -->
    <h1 class="text-2xl md:text-3xl font-extrabold text-gray-800">
      {{ productStore.productTitle }}
    </h1>

    <!-- ==============================
         Price Row
         ============================== -->
    <div class="flex items-center gap-4 flex-wrap">

      <!-- Final Price (red) -->
      <div class="text-rose-600 text-xl font-extrabold">
        {{ productStore.numberFormat(productStore.finalPrice) }} تومان
      </div>

      <!-- Original Price (strike-through) -->
      <div
        v-if="productStore.productsDiscountPercent > 0"
        class="text-gray-400 line-through text-base"
      >
        {{ productStore.numberFormat(productStore.productPrice) }} تومان
      </div>

      <!-- Discount Badge -->
      <div
        v-if="productStore.productsDiscountPercent > 0"
        class="bg-lime-200 text-lime-700 font-bold text-xs px-2 py-0.5 rounded-md"
      >
        {{ productStore.productsDiscountPercent }}٪
      </div>
    </div>

    <!-- ==============================
         Size Chart Button
         ============================== -->
    <button
      @click="$emit('show-size-modal')"
      class="bg-gray-300 text-gray-800 text-sm font-semibold py-1.5 px-4 rounded-md w-fit hover:bg-gray-400 transition"
    >
      جدول سایز
    </button>
  </div>
</template>

<script setup>
// Correct store path
import { useProductStore } from "../../stores/productDetails";
const productStore = useProductStore();
</script>
