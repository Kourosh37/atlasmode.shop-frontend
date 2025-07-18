<template>
  <div class="flex flex-col gap-6">
    <!-- ==============================
         Product Title
         ============================== -->
    <h2 class="text-2xl md:text-3xl font-extrabold text-amber-900 text-center md:text-right mb-2">
      {{ productStore.productTitle }}
    </h2>

    <!-- ==============================
         Price, Discount, and Status
         ============================== -->
    <div class="flex flex-wrap gap-4 items-center justify-center md:justify-start">
      <!-- Price & Discount Card -->
      <div class="flex flex-col gap-1 bg-amber-50 border-r-4 border-amber-700 rounded-lg px-6 py-4 min-w-[140px] shadow-inner">
        <span class="text-base font-bold text-gray-700">قیمت:</span>
        <span class="text-xl font-black text-emerald-700">
          {{ productStore.numberFormat(productStore.productPrice) }} تومان
        </span>
        <!-- Show discount if available -->
        <template v-if="productStore.productsDiscountPercent > 0">
          <span class="text-xs text-gray-500">
            تخفیف: {{ productStore.productsDiscountPercent }}٪
          </span>
          <span class="text-xs text-rose-600">
            مهلت تخفیف: {{ productStore.productDiscountDeadline || '-' }}
          </span>
          <span class="text-base font-bold text-green-700">
            قیمت نهایی: {{ productStore.numberFormat(productStore.finalPrice) }} تومان
          </span>
        </template>
      </div>
      <!-- Availability Card -->
      <div class="flex flex-col gap-1 bg-gray-100 border-r-4 border-gray-400 rounded-lg px-5 py-4 min-w-[100px] shadow-inner">
        <span class="text-base font-bold">وضعیت:</span>
        <span :class="productStore.productAvailibilityStatus === 'available' ? 'text-green-700' : 'text-gray-500'">
          {{ productStore.productAvailibilityStatus === "available" ? "موجود" : "ناموجود" }}
        </span>
        <span class="text-xs text-gray-500 mt-2">
          تعداد: {{ productStore.productQuantity }}
        </span>
      </div>
    </div>

    <!-- ==============================
         Product Categories
         ============================== -->
    <div class="flex flex-wrap items-center gap-2">
      <span class="font-bold text-gray-800">دسته‌بندی‌ها:</span>
      <ul class="flex gap-2 flex-wrap">
        <li
          v-for="cat in productStore.productCategories"
          :key="cat.id"
          class="bg-amber-100 rounded-xl px-3 py-0.5 text-xs md:text-sm text-amber-800 font-semibold shadow"
        >
          {{ cat.title }}
        </li>
      </ul>
    </div>

    <!-- ==============================
         Size Table Button
         ============================== -->
    <button
      class="bg-gradient-to-l from-amber-800 to-amber-500 hover:from-amber-900 hover:to-amber-700 text-white px-4 py-2 rounded-xl shadow-xl font-bold tracking-wider transition-all text-base min-w-[120px] w-fit mt-3"
      @click="$emit('show-size-modal')"
      type="button"
    >
      جدول سایز
    </button>
  </div>
</template>

<script setup>
// ==============================
// Imports & Store Instance
// ==============================
import { useProductStore } from "../../stores/productDetails";

/**
 * Product store instance containing all product details,
 * price, availability, discount, categories, etc.
 */
const productStore = useProductStore();
</script>
